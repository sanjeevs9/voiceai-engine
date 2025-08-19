import { logGroupName, logStreamName } from "../config/Constants";
import { pushLogEvent } from "../services/AWS/CloudWatch";
// import { updateCallDetails } from "../services/AWS/DynamoDB";
import {
  streamingChatCompletions,
  chatCompletions,
} from "../services/LLM/OpenAI";
import { getPollyStreams } from "../services/Synthesis/Polly";
import {
  Message,
  CallSessionData,
  WebsocketClient,
} from "../interfaces/Call.types";
import { Polly } from "aws-sdk";
import OpenAI from "openai";

// Sleep Function
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends clear message for a given websocket client.
 * @param {WebsocketConnection} ws - Client for which clear message needs to be sent.
 */

function clearWsClient(ws: WebsocketClient) {
  const twilioOutputEvent = {
    event: "clear",
    streamSid: ws.sessionData?.streamSid,
  };
  ws.send(JSON.stringify(twilioOutputEvent));
}

/**
 * Sends a media event for a given websocket client.
 * @param {WebsocketConnection} ws - Client for which the media event needs to be sent.
 * @param {Buffer} data - Audio Buffer data that needs to be sent to the client.
 */

function sendMediaEvent(ws: WebsocketClient, data: Polly.AudioStream) {
  const twilioOutputEvent = {
    event: "media",
    streamSid: ws.sessionData?.streamSid,
    media: {
      payload: data.toString("base64"),
    },
  };
  ws.send(JSON.stringify(twilioOutputEvent));
}

/**
 * Send a checkpoint event and Handle Call hangup.
 * @param {WebsocketConnection} ws - Client for which the media event needs to be sent.
 */

async function sendCheckPointEvent(ws: WebsocketClient) {
  const plivoCheckpointEvent = {
    event: "checkpoint",
    streamId: ws.sessionData?.streamSid,
    name: "customer greeting audio",
  };

  ws.send(JSON.stringify(plivoCheckpointEvent));
}

/**
 * Processes transcript received from deepgram and generate response through Open AI.
 * @param {WebsocketConnection} ws - Client for which deepgram messages need to be processed.
 * @param {String} content - The transcript message received from Deepgram.
 * @param {String} sectionName - Section from which deepgram transcript was received.
 */

// Process Response
async function processResponse(
  ws: WebsocketClient,
  content: string,
  sectionName: "utterance end" | "speech final",
) {
  try {
    if (ws.sessionData && ws.sessionData.messageContent) {
      ws.sessionData.messageContent.push({
        role: "assistant",
        content: ws.sessionData.currentAssistantMessage as string,
      });
      ws.sessionData.messageContent.push({ role: "user", content: content });
      ws.accumulatedText = "";
      await sleep(1000);

      ws.sessionData.isInterruptionDetected = false;
      ws.sessionData.currentAssistantMessage = "";
      await streamingChatCompletions(
        ws.sessionData.callSid,
        ws.sessionData.messageContent,
        async (chunk: OpenAI.Chat.Completions.ChatCompletionChunk) => {
          try {
            if (
              chunk.choices[0].delta.content &&
              chunk.choices[0].delta.content.length > 0
            ) {
              if (ws.sessionData && ws.sessionData.isInterruptionDetected) {
                clearWsClient(ws);
                return true;
              }
              ws.accumulatedText += chunk.choices[0].delta.content;
              const punctuationRegex = /[.?!।]/;
              const match = ws.accumulatedText.match(punctuationRegex);

              // Hangup Call if [Cut the call] present
              const cutCallIndex = ws.accumulatedText.indexOf("[Cut the call]");
              if (cutCallIndex !== -1) {
                sendCheckPointEvent(ws);
              }
              if (match && match.index) {
                await openAIToPolly(
                  ws.accumulatedText.substring(0, match.index + 1),
                  ws,
                );
                ws.accumulatedText =
                  match.index + 1 > ws.accumulatedText.length
                    ? ""
                    : ws.accumulatedText.substring(match.index + 1);
              }
            }
            return false;
          } catch (error) {
            console.log(error);
            // Pushing error to cloudwatch
            pushLogEvent(
              logGroupName,
              logStreamName,
              `CallSID: ${ws.sessionData?.callSid}, error: ${error}`,
            );
          }
        },
      );
      console.log(
        `Open AI message from ${sectionName} section - ${ws.sessionData?.currentAssistantMessage}`,
      );
    }
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

/**
 * Convert output from Open AI to speech and send back to Telephony.
 * @param {WebsocketConnection} ws - Client for which deepgram messages need to be processed.
 * @param {String} message - The message which needs to be converted to speech and sent back to Telephony.
 */

// Sending Open AI response to Polly
async function openAIToPolly(message: string, ws: WebsocketClient) {
  try {
    const data = (await getPollyStreams(message)) as Buffer;

    if (data) {
      for (let xx = 0; xx < data.length; xx += 10) {
        if (ws.sessionData && ws.sessionData.isInterruptionDetected) {
          clearWsClient(ws);
          break;
        }
        const chunk = data.slice(xx, xx + 10);
        // const chunk = new Uint8Array(data).slice(xx, xx + 10);
        sendMediaEvent(ws, chunk);
      }

      if (ws.sessionData && !ws.sessionData.isInterruptionDetected) {
        ws.sessionData.currentAssistantMessage += message;
      }
    }
  } catch (error) {
    console.log(error);
    // Pushing error to cloudwatch
    pushLogEvent(
      logGroupName,
      logStreamName,
      `CallSID: ${ws.sessionData?.callSid}, error: ${error}`,
    );
  }
}

// Get Call Outcome
async function getCallOutcome(
  conversationDetail: string,
  callOutcomePrompt: string,
) {
  const newDate = new Date().toISOString().split("T");
  const currentDate = newDate[0];
  const currentTime = newDate[1].split(".")[0];
  // Replacing date and time in outcome prompt
  callOutcomePrompt = callOutcomePrompt.replaceAll(
    "[Current_Date]",
    currentDate,
  );
  callOutcomePrompt = callOutcomePrompt.replaceAll(
    "[Current_Time]",
    currentTime,
  );

  const messageContent: Message[] = [
    { role: "user", content: conversationDetail },
    { role: "system", content: callOutcomePrompt },
  ];

  return chatCompletions(messageContent)
    .then((message) => {
      console.log("Open AI call outcome - " + message);
      return message;
    })
    .catch((error) => {
      console.error("Error determining call outcome:", error);
      return "Unable to determine outcome";
    });
}

// Process Call Outcome and update to dynamo
async function processCallOutcome(data: CallSessionData) {
  try {
    let j;
    let conversationTranscript = "";
    const callSid = data.callSid;
    const clientId = data.clientId as string;
    const callOutcomePrompt = data.callOutcomePrompt;
    const messageContent = data.messageContent;
    if (messageContent) {
      for (j = 0; j < messageContent.length; j++) {
        if (messageContent[j].role !== "system")
          conversationTranscript += `${messageContent[j].role}: ${messageContent[j].content},`;
      }

      let callOutcome = "";
      if (callOutcomePrompt) {
        callOutcome =
          (await getCallOutcome(conversationTranscript, callOutcomePrompt)) ||
          "";
      }

      // Update Call details after call ends
      const callDetails = {
        clientId,
        conversationTranscript,
        callOutcome,
      };
      // await updateCallDetails(callSid, callDetails);
      return;
    } else {
      throw new Error("Message Content Does not exist");
    }
  } catch (error) {
    console.log(error);
    // Pushing error to cloudwatch
    pushLogEvent(
      logGroupName,
      logStreamName,
      `CallSID: ${data.callSid}, error: ${error}`,
    );
  }
}

// Process Call Details update (recording link , status etc.)
// async function processCallDetailsUpdate(data, callSid, callStatus, clientId) {
//   let callDetails;
//   try {
//     if (callStatus === "completed") {
//       callDetails = {
//         clientId,
//         callStatus,
//         callDuration: data.CallDuration,
//         duration_: data.Duration,
//         recordingSid: data.RecordingSid,
//         recordingLink: data.RecordingUrl,
//         recordingDuration: data.RecordingDuration,
//         timestamp: data.Timestamp,
//       };
//     } else if (callStatus === "no-answer") {
//       callDetails = {
//         clientId,
//         callStatus,
//         initiatedTimestamp: data.Timestamp,
//       };
//     }

//     if (callStatus == "completed" || callStatus == "no-answer") {
//       await updateCallDetails(callSid, callDetails);
//       console.log(`Call Details updated`);
//       deleteSessionData(callSid); // Delete all sessionData
//       return true;
//     }
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
//   return true;
// }
export {
  sleep,
  clearWsClient,
  sendMediaEvent,
  processResponse,
  openAIToPolly,
  getCallOutcome,
  processCallOutcome,
  // processCallDetailsUpdate
};
