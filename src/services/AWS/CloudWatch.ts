import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const cloudwatchlogs = new AWS.CloudWatchLogs({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Used to create an AWS Log Group.
 * @param {string} logGroupName - The log group name that needs to be created.
 */

// Create log group
function createLogGroup(logGroupName: string) {
  cloudwatchlogs.createLogGroup({ logGroupName }, (err) => {
    if (err && err.code !== "ResourceAlreadyExistsException") {
      console.error("Error creating log group:", err);
      throw new Error("Error creating log group");
    }
  });
}

/**
 * Used to create an AWS Log Stream.
 * @param {string} logGroupName - The log group name that needs to be created.
 * @param {string} logStreamName - The log stream name that needs to be created.
 */

// Create log stream
function createLogStream(logGroupName: string, logStreamName: string) {
  cloudwatchlogs.createLogStream({ logGroupName, logStreamName }, (err) => {
    if (err && err.code !== "ResourceAlreadyExistsException") {
      console.error("Error creating log stream:", err);
      throw new Error("Error creating log stream");
    }
  });
}

/**
 * Used to push a log to a given log group and log stream.
 * @param {string} logGroupName - Log group where log needs to be pushed.
 * @param {string} logStreamName - Log stream where log needs to be pushed.
 * @param {string} logEvent - Log that needs to be pushed to given log group and log stream.
 */

// Function to push log events
async function pushLogEvent(
  logGroupName: string,
  logStreamName: string,
  logEvent: string,
) {
  const params = {
    logGroupName,
    logStreamName,
    logEvents: [
      {
        timestamp: Date.now(),
        message: logEvent,
      },
    ],
  };

  try {
    await cloudwatchlogs.putLogEvents(params).promise();
  } catch (error) {
    console.error("Error pushing log event:", error);
  }
}

export { createLogGroup, createLogStream, pushLogEvent };
