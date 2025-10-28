"use server";

import type { MastraMessageV2 } from "@mastra/core";
import { mastra } from "../../mastra";

export async function getMemory(
  formData: FormData
): Promise<MastraMessageV2[]> {
  // Form
  const provider = formData.get("provider")?.toString() as "OpenAI" | "Ollama";

  const selected =
    provider === "OpenAI" ? "financeCloudAgent" : "financeLocalAgent";
  const agent = mastra.getAgent(selected);

  const memory = await agent.getMemory();
  if (!memory) return [];

  const { messagesV2 } = await memory.query({
    threadId: "user-123",
  });

  return messagesV2;
}
