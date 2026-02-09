import { handleChatStream, toAISdkStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse, type UIMessage } from "ai";
import AgentLib, { type Agent } from "@/lib/agents";
import { updateThread } from "@/lib/threads";
import { mastra } from "@/mastra";

export async function POST(req: Request) {
  try {
    const request = await req.json();

    const { providerId, messages, threadId, firstMessage } = request as {
      providerId: Agent["displayName"];
      messages: UIMessage[];
      threadId: string;
      firstMessage: boolean;
    };

    if (firstMessage)
      await updateThread(threadId, {
        firstMessage: false,
      });

    const resourceId = "user-default";
    if (!providerId || !threadId) {
      return new Response("Faltan parámetros: providerId, threadId", {
        status: 400,
      });
    }

    const isEnabled = AgentLib.IsEnabled(providerId);
    const { agentName, id } = AgentLib.GetAgent(providerId) || {};

    if (!isEnabled || !agentName || !id) {
      return new Response(
        "Provider inválido. Debe ser 'OpenAI', 'Ollama' o 'xAI'",
        { status: 400 },
      );
    }

    const stream = await handleChatStream({
      mastra,
      agentId: id,
      params: {
        messages,
        memory: {
          thread: threadId,
          resource: resourceId,
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.log(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
