import WebSocket from "ws";
import { getSessionData } from "./data/CallSessionData";
import { getPollyStreams } from "./services/Synthesis/Polly";
import { deepgramEvents } from "./services/Transcribe/Deepgram";
import {
  clearWsClient,
  sendMediaEvent,
  processCallOutcome,
} from "./utils/Helper";
import { WebsocketClient } from "./interfaces/Call.types";
import { CallSessionData } from "./interfaces/Call.types";

/**
 * Initializes websocket to specify actions to be performed.
 * @param {WebSocket.Server} wss - The websocket which needs to be initialized.
 */

function initializeWebSocket(wss: WebSocket.Server) {
  wss.on("connection", function connection(ws: WebsocketClient) {
    console.log("New Connection Initiated");

    //Handling websocket messages from clients
    ws.on("message", async function incoming(message) {
      const msg = JSON.parse(message.toString());

      switch (msg.event) {
        case "connected":
          console.log(`A new call has connected.`);
          break;

        case "start":
          ws.sessionData = initializeSessionData(
            msg.start.callSid,
            msg.streamSid,
          );

          if (ws.sessionData.deepgramConnection) {
            deepgramEvents(
              ws,
              ws.sessionData.deepgramConnection,
              ws.sessionData.index || 0,
            );
          }
          console.log(`Starting Media Stream ${msg.streamSid}`);

          sendGreetMessage(ws.sessionData.greetMessage || "", ws);
          break;

        case "media":
          if (msg.media.track && msg.media.track === "inbound") {
            ws.sessionData?.deepgramConnection?.send(
              Buffer.from(msg.media.payload, "base64"),
            );
          }
          break;

        case "stop":
          console.log(`Stream Has Ended`);
          break;
      }
    });
    ws.on("error", function (err) {
      console.error("WebSocket Error:", err);
      cleanupSocketSession(ws);
    });

    ws.on("close", async function (code) {
      // Process CallOutcome and update to dynamo
      if (ws.sessionData) {
        await processCallOutcome(ws.sessionData);
        console.log(`Call Outcome updated`);
      }

      console.log(`Websocket connection closed: ${code}`);
      cleanupSocketSession(ws);
    });
  });
}

// CleanUp Web socket session Data
function cleanupSocketSession(ws: WebsocketClient) {
  if (ws.sessionData) {
    if (ws.sessionData.deepgramConnection) {
      ws.sessionData.deepgramConnection.requestClose();
      ws.sessionData.deepgramConnection = null;
    }
    ws.sessionData = null;
  }
}

/**
 * Initializes session data for a given websocket client.
 * @param {string} callSid - The websocket client for which session data needs to be initialized.
 * @param {string} streamSid - The websocket client for which session data needs to be initialized.
 */

function initializeSessionData(callSid: string, streamSid: string) {
  const currentCallSessionData = getSessionData(callSid);
  const sessionData: CallSessionData = {
    callSid,
    streamSid,
    isInterruptionDetected: false,
    currentAssistantMessage: currentCallSessionData.greetMessage,
    deepgramConnection: currentCallSessionData.deepgramConnection,
    messageContent: [
      { role: "system", content: currentCallSessionData.prompt },
    ],
    greetMessage: currentCallSessionData.greetMessage,
    index: currentCallSessionData.index,
    callOutcomePrompt: currentCallSessionData.callOutcomePrompt,
    clientId: currentCallSessionData.clientId,
  };

  return sessionData;
}

/**
 * Sends a greet message to a client.
 * @param {Websocket Connection} ws - The websocket client for which we need to send greet message.
 * @param {String} greetMessage - The greet message that needs to be sent.
 */

function sendGreetMessage(greetMessage: string, ws: WebsocketClient) {
  getPollyStreams(greetMessage).then((data) => {
    if (data) {
      clearWsClient(ws);
      sendMediaEvent(ws, data);
    }
  });
}

export { initializeWebSocket };
