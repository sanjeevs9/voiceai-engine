// import AWS from "aws-sdk";
// import { phoneCallDetailsTableName } from "../../config/Constants";
// import dotenv from "dotenv";
// import { CallSessionData, UpdateDetails } from "../../interfaces/Call.types";
// dotenv.config();

// AWS.config.update({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const dynamoClient = new AWS.DynamoDB.DocumentClient();

// // Create A new call Entry in then dynamoDB
// const createCallEntry = async (callDetails: CallSessionData) => {
//   const params = {
//     TableName: phoneCallDetailsTableName,
//     Item: callDetails,
//   };

//   try {
//     await dynamoClient.put(params).promise();
//     console.log(`Call added to Table successfully`);
//   } catch (err) {
//     console.error("Error adding call:", err);
//     throw new Error("Error adding call");
//   }
// };

// // Update Call details
// const updateCallDetails = async (
//   callSid: string,
//   updateDetails: UpdateDetails,
// ) => {
//   const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
//     TableName: phoneCallDetailsTableName,
//     Key: {
//       clientId: updateDetails.clientId, // partition Key
//       callSid: callSid, // sort key
//     },
//   };

//   const updateExpression = [];
//   const expressionAttributeValues: {
//     [key: string]: string | number | undefined;
//   } = {};

//   // Conditionally add each field to the update expression
//   if (updateDetails.callStatus !== undefined) {
//     updateExpression.push("callStatus = :status");
//     expressionAttributeValues[":status"] = updateDetails.callStatus;
//   }
//   if (updateDetails.conversationTranscript !== undefined) {
//     updateExpression.push("conversationTranscript = :transcript");
//     expressionAttributeValues[":transcript"] =
//       updateDetails.conversationTranscript;
//   }
//   if (updateDetails.callOutcome !== undefined) {
//     updateExpression.push("callOutcome = :outcome");
//     expressionAttributeValues[":outcome"] = updateDetails.callOutcome;
//   }
//   if (updateDetails.callDuration !== undefined) {
//     updateExpression.push("callDuration = :callDuration");
//     expressionAttributeValues[":callDuration"] = updateDetails.callDuration;
//   }
//   if (updateDetails.duration !== undefined) {
//     updateExpression.push("duration_ = :duration_");
//     expressionAttributeValues[":duration_"] = updateDetails.duration;
//   }
//   if (updateDetails.recordingLink !== undefined) {
//     updateExpression.push("recordingLink = :recordingLink");
//     expressionAttributeValues[":recordingLink"] = updateDetails.recordingLink;
//   }
//   if (updateDetails.recordingSid !== undefined) {
//     updateExpression.push("recordingSid = :recordingSid");
//     expressionAttributeValues[":recordingSid"] = updateDetails.recordingSid;
//   }
//   if (updateDetails.recordingId !== undefined) {
//     updateExpression.push("recordingId = :recordingId");
//     expressionAttributeValues[":recordingId"] = updateDetails.recordingId;
//   }
//   if (updateDetails.recordingDuration !== undefined) {
//     updateExpression.push("recordingDuration = :recordingDuration");
//     expressionAttributeValues[":recordingDuration"] =
//       updateDetails.recordingDuration;
//   }
//   if (updateDetails.endTime !== undefined) {
//     updateExpression.push("endTime = :endTime");
//     expressionAttributeValues[":endTime"] = updateDetails.endTime;
//   }
//   if (updateDetails.startTime !== undefined) {
//     updateExpression.push("startTime = :startTime");
//     expressionAttributeValues[":startTime"] = updateDetails.startTime;
//   }

//   if (updateExpression.length > 0) {
//     params.UpdateExpression = `set ${updateExpression.join(", ")}`;
//     params.ExpressionAttributeValues = expressionAttributeValues;

//     try {
//       await dynamoClient.update(params).promise();
//       console.log(`Call Table updated successfully`);
//     } catch (err) {
//       console.error("Error updating call:", err);
//       throw new Error("Error updating call");
//     }
//   } else {
//     console.log("No update fields provided.");
//   }
// };

// export { createCallEntry, updateCallDetails };
