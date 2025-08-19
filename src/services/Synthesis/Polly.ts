import dotenv from "dotenv";
import AWS from "aws-sdk";
import {
  pollyEngine,
  pollyOutputFormat,
  pollyVoiceId,
  pollySampleRate,
} from "../../config/Constants";
dotenv.config();

const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Used to convert a given text to speech using Amazon Polly.
 * @param {string} text - The message content for which speech needs to be generated.
 */

async function getPollyStreams(text: string): Promise<Buffer> {
  const params = {
    Engine: pollyEngine,
    OutputFormat: pollyOutputFormat, // Audio format (e.g., mp3, ogg_vorbis, pcm)
    Text: text, // Text to synthesize
    VoiceId: pollyVoiceId, // Polly voice (e.g., Joanna, Matthew)
    SampleRate: pollySampleRate, // Sample rate in Hz (optional)
  };

  try {
    // Call Polly's synthesizeSpeech method
    const data = await polly.synthesizeSpeech(params).promise();

    const ulawAudio = linearToMuLaw(data.AudioStream as Buffer);

    return ulawAudio;
  } catch (error) {
    console.log(error);
    throw new Error("AWS Polly Error");
  }
}

function linearToMuLaw(linearPCM: Buffer): Buffer {
  const ulawAudio = Buffer.alloc(linearPCM.length / 2); // µ-law is 8-bit, PCM is 16-bit, hence half the size

  for (let i = 0; i < linearPCM.length; i += 2) {
    // Read 16-bit PCM sample (little-endian)
    const sample = linearPCM.readInt16LE(i);
    const ulawSample = pcmSampleToMuLaw(sample);
    ulawAudio[i / 2] = ulawSample;
  }

  return ulawAudio;
}

function pcmSampleToMuLaw(pcmSample: number) {
  const mu = 255; // µ-law constant
  const MAX = 32635; // Max magnitude for µ-law encoding

  // Get the sign bit. Invert the sample if it's negative.
  const sign = (pcmSample >> 8) & 0x80;
  if (pcmSample < 0) pcmSample = -pcmSample;
  if (pcmSample > MAX) pcmSample = MAX;

  // Perform µ-law compression
  const magnitude = Math.log(1 + (mu * pcmSample) / 32768) / Math.log(1 + mu);

  // Combine the sign bit with the magnitude
  const ulawSample = ~(sign | (magnitude * 127)) & 0xff;

  return ulawSample;
}

export { getPollyStreams };
