import {
  ListenLiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import { clearWsClient, processResponse } from "../../utils/Helper";
import {
  deepgramModel,
  deepgramLanguage,
  deepgramInterimResults,
  deepgramUtteranceEndMs,
  deepgramEncoding,
  deepgramSampleRate,
  deepgramPunctuate,
  deepgramEndpointing,
  deepgramApiKeys,
  logGroupName,
  logStreamName,
} from "../../config/Constants";
import { pushLogEvent } from "../AWS/CloudWatch";
import { WebsocketClient } from "../../interfaces/Call.types";
import dotenv from "dotenv";

dotenv.config();

// Constants for backoff
const activeCallsPerKey = Array(deepgramApiKeys.length).fill(0); // Active Calls per Deepgram API key
const maxCallsPerKey = 38; // Concurrency Limit per Deepgram API key
const baseDelay = 10000; // 15 seconds - base delay when keys are unavailable
const maxDelay = 300000; // 5 mins - max delay for backoff
const maxRetries = 6; // Retries for backoff

// FInd Available api key
function findAvailableApiKey() {
  for (let i = 0; i < deepgramApiKeys.length; i++) {
    if (activeCallsPerKey[i] < maxCallsPerKey) {
      return { key: deepgramApiKeys[i], index: i };
    }
  }
  throw new Error("All API keys are at their concurrency limit.");
}

// Initialize deepgram Client
async function createDeepgramClient(retryCount = 0) {
  const backoffDelay = Math.min(baseDelay * 2 ** retryCount, maxDelay);
  try {
    const { key, index } = findAvailableApiKey();
    activeCallsPerKey[index]++;
    const deepgram = createClient(key);

    return { deepgram, index };
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating Deepgram connection");

      if (retryCount >= maxRetries) {
        throw new Error("Max retries reached.");
      }

      await new Promise((resolve) => {
        setTimeout(resolve, backoffDelay);
      });

      return await createDeepgramClient(retryCount + 1);
    } else {
      console.error("An unknown error occurred.");
    }
  }
}

/**
 * Creates a deepgram connection.
 */
async function createDeepgramConnection() {
  try {
    const response = await createDeepgramClient();
    if (response) {
      const { deepgram, index } = response;
      const deepgramConnection = deepgram.listen.live({
        model: deepgramModel,
        language: deepgramLanguage,
        interim_results: deepgramInterimResults,
        utterance_end_ms: deepgramUtteranceEndMs,
        encoding: deepgramEncoding,
        sample_rate: deepgramSampleRate,
        punctuate: deepgramPunctuate,
        endpointing: deepgramEndpointing,
      });

      return { deepgramConnection, index };
    } else {
      console.log("Something went wrong");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Problem connecting to deepgram");
  }
}

/**
 * Processes deepgram events.
 * @param {Websocket} ws - Client for which deepgram messages need to be processed.
 * @param {DeepgramConnection} deepgramConnection - Deepgram connection which resolves the incoming messages.
 */

function deepgramEvents(
  ws: WebsocketClient,
  deepgramConnection: ListenLiveClient,
  index: number,
) {
  ws.utteranceEndText = "";
  ws.finalResult = "";
  ws.speechFinal = false;
  ws.text = "";
  let keepAliveInterval: NodeJS.Timeout;

  // On Connection Open
  deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Deepgram connection open");
    keepAliveInterval = setInterval(() => {
      deepgramConnection.keepAlive();
    }, 3000);
  });

  // On Connection Close
  deepgramConnection.on(LiveTranscriptionEvents.Close, () => {
    console.log("Deepgram connection closed.");
    clearInterval(keepAliveInterval);
    clearDeepgramConnection(ws, deepgramConnection, index);
  });

  deepgramConnection.on(LiveTranscriptionEvents.Error, (err) => {
    console.error(err);
    clearInterval(keepAliveInterval);
    clearDeepgramConnection(ws, deepgramConnection, index);
  });

  // Transciption
  deepgramConnection.on(LiveTranscriptionEvents.Transcript, async (data) => {
    const alternatives = data.channel?.alternatives;

    if (alternatives) {
      ws.text = alternatives[0]?.transcript;
    }
    if (data.is_final === true && ws.text && ws.text.trim().length > 0) {
      ws.finalResult += `${ws.text} `;

      const interrupt =
        !(
          ws.text &&
          (ws.text.toLowerCase().includes("hello") || ws.text.includes("हेलो"))
        ) || !(ws.text && ws.text.trim().length <= 7);

      // if speech_final and is_final that means this text is accurate and it's a natural pause in the speakers speech. We need to send this to the assistant for processing
      if (
        data.speech_final === true &&
        ws.utteranceEndText &&
        ws.utteranceEndText.trim().length === 0 &&
        interrupt
      ) {
        ws.speechFinal = true; // this will prevent a utterance end which shows up after speechFinal from sending another response
        processDeepgramTranscription(ws, "speech final", ws.finalResult || "");
        ws.finalResult = "";
        ws.text = "";
      } else {
        // if we receive a message without speechFinal reset speechFinal to false, this will allow any subsequent utteranceEnd messages to properly indicate the end of a message
        ws.speechFinal = false;
      }
    }
  });

  // utterance End Section
  deepgramConnection.on(LiveTranscriptionEvents.UtteranceEnd, async () => {
    ws.utteranceEndText = ws.finalResult;

    const interrupt =
      !(
        ws.finalResult?.toLowerCase().includes("hello") ||
        ws.finalResult?.includes("हेलो")
      ) || !(ws.finalResult.trim().length <= 7);

    if (
      ws.utteranceEndText &&
      ws.utteranceEndText.trim().length > 0 &&
      !ws.speechFinal &&
      interrupt
    ) {
      processDeepgramTranscription(ws, "utterance end", ws.utteranceEndText);

      ws.finalResult = "";
      ws.text = "";
      ws.utteranceEndText = "";
    }
  });
}

/**
 * Processes transcript received from deepgram.
 * @param {Websocket} ws - Client for which deepgram messages need to be processed.
 * @param {String} sectionName - Section from which deepgram transcript was received.
 * @param {String} transcription - The transcript message received from Deepgram.
 */

function processDeepgramTranscription(
  ws: WebsocketClient,
  sectionName: "utterance end" | "speech final",
  transcription: string,
) {
  try {
    if (ws.sessionData) {
      ws.sessionData.isInterruptionDetected = true;
    }
    clearWsClient(ws); // Send a clear event to twilio for the ws clients
    console.log(
      `Transcribed output from ${sectionName} section - ${transcription}`,
    );
    processResponse(ws, transcription, sectionName);
  } catch (err) {
    console.log(err);
    // Pushing error to cloudwatch
    pushLogEvent(
      logGroupName,
      logStreamName,
      `CallSID: ${ws.sessionData?.callSid}, error: ${err}`,
    );
  }
}

// Close all connections and cleanup variables
function clearDeepgramConnection(
  ws: WebsocketClient,
  deepgramConnection: ListenLiveClient,
  index: number,
) {
  activeCallsPerKey[index]--;

  if (deepgramConnection) {
    deepgramConnection.requestClose();
  }

  if (ws.sessionData) ws.sessionData = null;
  ws.utteranceEndText = null;
  ws.finalResult = null;
  ws.speechFinal = null;
  ws.text = null;
}

export { createDeepgramConnection, deepgramEvents };
