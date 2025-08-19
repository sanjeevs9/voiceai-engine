import { Twilio } from "twilio";
import dotenv from "dotenv";
import { telephonyDomainUrl } from "../../config/Constants";

dotenv.config();

// Initialize Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/**
 * Initiates an outgoing call and streams media to a WebSocket server.
 * @param {string} toNumber - The customer's phone number.
 */

async function startOutgoingCall(toNumber: string) {
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!fromNumber) {
    throw new Error("Twilio number not found");
  }

  try {
    const callDetails = await twilioClient.calls.create({
      url: telephonyDomainUrl,
      // record: true,
      to: toNumber,
      from: fromNumber,
      statusCallback: `${telephonyDomainUrl}/callback`,
      record: true,
      statusCallbackEvent: ["ringing", "completed", "no-answer"],
    });
    console.log("Call successful! - " + callDetails.sid);
    return callDetails.sid;
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Error Starting a call from twilio");
  }
}

export { startOutgoingCall };
