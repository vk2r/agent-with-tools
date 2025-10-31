import { mastra } from "@/mastra";

export async function POST(req: Request) {
  try {
    const { provider, threadId } = (await req.json()) as {
      provider: "OpenAI" | "Ollama";
      threadId: string;
    };
    const resourceId = "user-default";

    if (!provider || !resourceId || !threadId) {
      return new Response("Faltan parámetros: provider, resourceId, threadId", {
        status: 400,
      });
    }

    if (provider !== "OpenAI" && provider !== "Ollama") {
      return new Response("Provider inválido. Debe ser 'OpenAI' u 'Ollama'", {
        status: 400,
      });
    }

    const selected =
      provider === "OpenAI" ? "financeCloudAgent" : "financeLocalAgent";
    const agent = mastra.getAgent(selected);

    const memory = await agent.getMemory();
    if (!memory) {
      return new Response(JSON.stringify({ messages: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages, uiMessages } = await memory.query({
      threadId,
      resourceId,
    });

    return new Response(JSON.stringify({ messages, uiMessages }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
