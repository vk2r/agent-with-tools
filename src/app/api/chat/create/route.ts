import { toAISdkStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse, stepCountIs, type UIMessage } from "ai";
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
    const lastMessage = messages
      .filter((message) => message.role === "user")
      .findLast((message) =>
        message.parts.find((part) => part.type === "text"),
      );

    if (!providerId || !threadId) {
      return new Response("Faltan parámetros: providerId, threadId", {
        status: 400,
      });
    }

    const isEnabled = AgentLib.IsEnabled(providerId);
    const { agentName, reasoningEffort } = AgentLib.GetAgent(providerId) || {};

    if (!isEnabled || !agentName) {
      return new Response(
        "Provider inválido. Debe ser 'OpenAI', 'Ollama' o 'xAI'",
        { status: 400 },
      );
    }

    const agent = mastra.getAgent(agentName);
    const stream = await agent.stream(lastMessage, {
      stopWhen: stepCountIs(10),
      providerOptions: {
        openai: { reasoningEffort },
      },
      savePerStep: true,
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });

    return createUIMessageStreamResponse({
      stream: toAISdkStream(stream, { from: "agent" }),
    });
  } catch (error) {
    console.error(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
