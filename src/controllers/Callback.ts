import { Request, Response } from "express";
// import { updateCallDetails } from "../services/AWS/DynamoDB";
// import { pushLogEvent } from "../services/AWS/CloudWatch";
// import { logGroupName, logStreamName } from "../config/Constants";
import { getSessionData } from "../data/CallSessionData";
// import { processCallDetailsUpdate } from "../utils/Helper";

/**
 * Returns a record object.
 * @param {object} req - The request payload from outbound endpoint.
 * @param {object} res - The response payload for outbound endpoint.
 */
const callEndCallback = async (req: Request, res: Response) => {
  const { CallSid, CallStatus } = req.body;
  const clientId = getSessionData(CallSid).clientId;

  console.log(`Call Status : ${CallStatus}`);

  // const success = await processCallDetailsUpdate(
  //     req.body,
  //     CallSid,
  //     CallStatus,
  //     clientId
  // );

  // if (success) {
  res.send({ message: "Call Finished", clientId });
  return;
  // } else {
  //     res.status(500).send({ message: "Internal Server Error" });
  //     return;
  // }
};

// const recordingCallback = async (req: Request, res: Response) => {
//     const callSid = req.body.callSid;
//     const clientId = getSessionData(callSid).clientId;

//     const callDetails = {
//         clientId,
//         recordingLink: req.body.RecordUrl,
//         recordingSid: req.body.RequestUUID,
//         recordingId: req.body.RecordingID,
//     };

//     try {
//         await updateCallDetails(callSid, callDetails);
//         console.log("Recording details updated");
//         res.status(200).json({ message: 'Success' })
//     } catch (error) {
//         console.error("Error updating recording details");
//         // Pushing error to cloudwatch
//         pushLogEvent(
//             logGroupName,
//             logStreamName,
//             `CallSID: ${callSid}, error: ${error}`
//         );
//     }
// };

// const hangupCallback = async (req: Request, res: Response) => {
//     const callSid = req.body.callSid;
//     const callStatus = req.body.CallStatus;
//     const hangupCode = req.body.HangupCauseCode;
//     const clientId = getSessionData(callSid).clientId;

//     let callDetails;
//     try {
//         // If user rejected the call (busy) or didn't pick (no-answer)
//         if (hangupCode === "3010" || hangupCode === "3000") {
//             const message =
//                 hangupCode == "3010" ? "Call was Rejected." : "Call not answered";

//             callDetails = {
//                 clientId,
//                 callStatus: callStatus,
//             };

//             await updateCallDetails(callSid, callDetails);
//             console.log(message);
//         }
//         // In case of normal hangup by user or hangup API checkpoint event
//         else if (hangupCode == "4000") {
//             callDetails = {
//                 clientId,
//                 callStatus: callStatus,
//                 callDuration: req.body.Duration,
//                 startTime: req.body.StartTime,
//                 endTime: req.body.EndTime,
//             };

//             await updateCallDetails(callSid, callDetails);
//             console.log("Call has completed");
//         }

//         // deleteSessionData(callSid); // Delete session data of the call
//         res.status(200).json({ message: 'Success' })
//     } catch (error) {
//         console.error(error);
//         // Pushing error to cloudwatch
//         pushLogEvent(
//             logGroupName,
//             logStreamName,
//             `CallSID: ${callSid}, error: ${error}`
//         );
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// };

export { callEndCallback };
