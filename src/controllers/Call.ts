import { Request, Response } from "express";
// import { getObjectFromS3 } from "../services/AWS/S3";
import {
  promptBucketName,
  greetMessageBucketName,
  logGroupName,
  logStreamName,
  callOutcomeBucketName,
  prompt as promptConstant,
  greetMessage as greetMessageConstant,
  callOutcomePrompt as callOutcomePromptConstant,
} from "../config/Constants";
import {
  createLogGroup,
  createLogStream,
  pushLogEvent,
} from "../services/AWS/CloudWatch";
import { createDeepgramConnection } from "../services/Transcribe/Deepgram";
import { storeSessionData } from "../data/CallSessionData";
// import { createCallEntry } from "../services/AWS/DynamoDB";
import { startOutgoingCall } from "../services/Telephony/Twilio";
import dotenv from "dotenv";

dotenv.config();

/**
 * Starts an outbound call.
 * @param {string} req - The request payload from outbound endpoint.
 * @param {object} res - The response payload for outbound endpoint.
 */
const makeOutboundCall = async (req: Request, res: Response) => {
  let callSid;
  const clientId = req.body.clientId;
  const toNumber = req.body.toNumber;
  const numAttempts = 2;
  // const promptFileName = req.body.promptFileName;
  // const greetMessageFileName = req.body.greetMessageFileName;
  // const callOutcomeFileName = req.body.callOutcomePromptFileName;
  const customerDetails = req.body.customerDetails
    ? req.body.customerDetails
    : null;

  //Generating object keys for prompt and greet message
  // const promptObjectKey = clientId + "/" + promptFileName;
  // const greetMessageObjectKey = clientId + "/" + greetMessageFileName;
  // const callOutcomePromptObjectKey = clientId + "/" + callOutcomeFileName;

  try {
    // Fetching client specific prompt
    // let prompt = await getObjectFromS3(promptBucketName, promptObjectKey);

    //Fetching client specific greet message
    // const greetMessage = await getObjectFromS3(
    //   greetMessageBucketName,
    //   greetMessageObjectKey,
    // );

    // Fetching client specific callOutcome
    // const callOutcomePrompt = await getObjectFromS3(
    //   callOutcomeBucketName,
    //   callOutcomePromptObjectKey,
    // );

    let prompt = promptConstant;
    let greetMessage = greetMessageConstant;
    let callOutcomePrompt = callOutcomePromptConstant;

    if (!prompt || !greetMessage) {
      throw new Error("Prompt or greetMessage Missing");
    }

    //Replacing customer details in the prompt
    if (customerDetails != null) {
      Object.entries(customerDetails).forEach(([key, value]) => {
        prompt = prompt!.replaceAll(key as string, value as string);
      });
    }

    //Creating log group and log stream to capture logs
    createLogGroup(logGroupName);
    createLogStream(logGroupName, logStreamName);

    //Creating deepgram connection
    const { deepgramConnection, index } =
      (await createDeepgramConnection()) ?? {};

    setInterval(() => {
      deepgramConnection?.keepAlive();
    }, 3000);

    //Creating call to customer
    callSid = await startOutgoingCall(toNumber);

    //Storing session specific data
    const currentCallSessionData = {
      callSid,
      deepgramConnection: deepgramConnection,
      prompt: prompt,
      greetMessage: greetMessage,
      callOutcomePrompt: callOutcomePrompt,
      index: index,
      clientId: clientId,
    };
    storeSessionData(callSid, currentCallSessionData);

    // Push Call Details to dynamoDB Phone call Table
    const callDetails = {
      clientId,
      callSid,
      toPhoneNumber: toNumber,
      fromPhoneNumber: process.env.PLIVO_PHONE_NUMBER,
      voiceAgentId: null,
      promptId: null,
      greetMessageId: null,
      callOutcomePromptId: null,
      customerDetails,
      numAttempts,
    };

    // createCallEntry(callDetails);

    //Sending a response back to calling function
    const response = {
      message: "Call registered successfully!",
    };
    res.send(response);
  } catch (error) {
    // Pushing error to cloudwatch
    if (callSid) {
      pushLogEvent(
        logGroupName,
        logStreamName,
        `CallSid: ${callSid}, error: ${error}`,
      );
    } else {
      pushLogEvent(logGroupName, logStreamName, `error: ${error}`);
    }
    console.log(error);
    const response = {
      message: "Failed to initiate the call!",
    };
    res.status(500).send(response);
  }
};

/**
 * Returns an XML response containing details on bidirectional stream setup.
 * @param {string} req - The request payload for plivoResponse endpoint.
 * @param {object} res - The response payload for plivoResponse endpoint.
 */
const twilioResponse = (req: Request, res: Response) => {
  res.set("Content-Type", "text/xml");
  res.send(`
      <Response>
          <Connect><Stream url="wss://${req.headers.host}"/></Connect>
      </Response>
    `);
};

export { makeOutboundCall, twilioResponse };
