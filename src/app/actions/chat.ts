"use server";

import { nanoid } from "nanoid";
import { addThread } from "@/lib/threads";

// Definitions
export type GetChatProps = {
  threadId: string;
  provider: "OpenAI" | "Ollama";
};

export async function createThread({
  message,
  provider,
}: {
  message: string;
  provider: "OpenAI" | "Ollama";
}): Promise<string> {
  const id = nanoid();
  await addThread({
    id,
    title: message,
    firstMessage: true,
    providerId: provider,
  });
  return id;
}
