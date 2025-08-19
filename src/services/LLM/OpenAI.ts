import { OpenAI } from "openai";
import { pushLogEvent } from "../AWS/CloudWatch";
import {
  openAiModel,
  openAiResponseTemperature,
  logGroupName,
  logStreamName,
} from "../../config/Constants";
import dotenv from "dotenv";
import { Message, ChunkHandler } from "../../interfaces/Call.types";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Used to stream the response generated from Open AI for a given message content.
 * @param {string} callSid - The unique id for every call.
 * @param {string} messageContent - The message content for which response needs to be generated.
 * @param {call function} chunkHandler - Provides a way to handle the chunks generated.
 */

async function streamingChatCompletions(
  callSid: string,
  messageContent: Message[],
  chunkHandler: ChunkHandler,
) {
  try {
    pushLogEvent(
      logGroupName,
      logStreamName,
      `CallSID: ${callSid}, msgContent: ${JSON.stringify(messageContent)}`,
    );

    const completion = await openai.chat.completions.create({
      messages: messageContent,
      model: openAiModel,
      temperature: openAiResponseTemperature,
      stream: true,
    });

    for await (const chunk of completion) {
      const stopStreamingSignal = await chunkHandler(chunk);
      if (stopStreamingSignal) {
        break;
      }
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("Error while streaming openAI chat completions");
  }
}
// Chat completions
async function chatCompletions(messageContent: Message[]) {
  try {
    const completion = await openai.chat.completions.create({
      messages: messageContent,
      model: "gpt-4o-mini",
      temperature: 0,
    });

    const message = completion.choices[0].message.content;
    return message;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("Error while openAI chat completions");
  }
}

export { streamingChatCompletions, chatCompletions };
