import { ListenLiveClient } from "@deepgram/sdk";
import OpenAI from "openai";
import { WebSocket } from "ws";

// Call and its data types
export interface CallSessionData {
  callSid: string;
  streamSid?: string;
  clientId?: string;
  prompt?: string;
  greetMessage?: string;
  callOutcomePrompt?: string;
  deepgramConnection?: ListenLiveClient | null;
  index?: number;
  isInterruptionDetected?: boolean;
  currentAssistantMessage?: string;
  messageContent?: Message[];
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface WebsocketClient extends WebSocket {
  sessionData: CallSessionData | null;
  utteranceEndText: string | null;
  finalResult: string | null;
  speechFinal: boolean | null;
  text: string | null;
  accumulatedText: string;
}

export type ChunkHandler = (
  chunk: OpenAI.Chat.Completions.ChatCompletionChunk,
) => Promise<boolean | undefined>;

export interface UpdateDetails {
  clientId: string;
  callStatus?: string;
  conversationTranscript?: string;
  callOutcome?: string;
  callDuration?: string;
  duration?: string;
  recordingLink?: string;
  recordingSid?: string;
  recordingId?: string;
  recordingDuration?: string;
  endTime?: string;
  startTime?: string;
}
