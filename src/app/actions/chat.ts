"use server";
import type { UIMessage } from "@ai-sdk/react";
import { toAISdkV5Messages } from "@mastra/ai-sdk/ui";
import { nanoid } from "nanoid";

import AgentLib, { type Agent } from "@/lib/agents";
import { addThread } from "@/lib/threads";
import { mastra } from "@/mastra";

export async function getInitialMessages(
  threadId: string,
  providerId: Agent["displayName"],
): Promise<UIMessage[]> {
  try {
    const resourceId = "user-default";
    const agentName = AgentLib.GetAgent(providerId)?.agentName;

    if (!agentName) return [];

    const agent = mastra.getAgent(agentName);
    const memory = await agent.getMemory();

    if (!memory) return [];

    const { messages } = await memory.recall({ threadId, resourceId });

    return toAISdkV5Messages(messages);
  } catch (error) {
    console.log(error);
    return [];
  }
}

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
