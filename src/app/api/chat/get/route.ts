// Agent libs
import { toAISdkV5Messages } from "@mastra/ai-sdk/ui";
import { NextResponse } from "next/server";
import { mastra } from "@/mastra";

import AgentLib, { type Agent } from "@/lib/agents";

export async function POST(req: Request) {
  try {
    const { provider, threadId } = (await req.json()) as {
      provider: Agent["displayName"];
      threadId: string;
    };

    const resourceId = "user-default";
    const isEnabled = AgentLib.IsEnabled(provider);
    const agentName = AgentLib.GetAgent(provider)?.id;

    if (!provider || !resourceId || !threadId) {
      return new Response("Faltan parámetros: provider, resourceId, threadId", {
        status: 400,
      });
    }

    if (!isEnabled || !agentName) {
      return new Response(
        "Provider inválido. Debe ser 'OpenAI', 'Ollama' o 'xAI'",
        {
          status: 400,
        },
      );
    }

    const memory = await mastra.getAgentById(agentName).getMemory();
    if (!memory) {
      return new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await memory.recall({
      threadId,
      resourceId,
    });

    const uiMessages = toAISdkV5Messages(response?.messages || []);
    return NextResponse.json(uiMessages);
  } catch (error) {
    console.error(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
