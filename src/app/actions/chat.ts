"use server";

import { nanoid } from "nanoid";
import type { Agent } from "@/lib/agents";
import { addThread } from "@/lib/threads";

// Definitions
export type GetChatProps = {
  threadId: string;
  provider: Agent["displayName"];
};

export async function createThread({
  message,
  provider,
}: {
  message: string;
  provider: Agent["displayName"];
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
