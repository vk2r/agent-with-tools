// Agent libs
import AgentLib, { type Agent } from "@/lib/agents";

import { mastra } from "@/mastra";

export async function POST(req: Request) {
  try {
    const { provider, threadId } = (await req.json()) as {
      provider: Agent["displayName"];
      threadId: string;
    };

    const resourceId = "user-default";
    const isEnabled = AgentLib.IsEnabled(provider);
    const agentName = AgentLib.GetAgent(provider)?.agentName;

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

    const agent = mastra.getAgent(agentName);
    const memory = await agent.getMemory();
    if (!memory) {
      return new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await memory.recall({
      threadId,
      resourceId,
    });

    return new Response(JSON.stringify({ messages }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
