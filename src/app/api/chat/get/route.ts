import { mastra } from "@/mastra";

export async function POST(req: Request) {
  try {
    const { provider, threadId } = (await req.json()) as {
      provider: "OpenAI" | "Ollama" | "xAI";
      threadId: string;
    };
    const resourceId = "user-default";

    if (!provider || !resourceId || !threadId) {
      return new Response("Faltan parámetros: provider, resourceId, threadId", {
        status: 400,
      });
    }

    if (!["OpenAI", "Ollama", "xAI"].includes(provider)) {
      return new Response(
        "Provider inválido. Debe ser 'OpenAI', 'Ollama' o 'xAI'",
        {
          status: 400,
        },
      );
    }

    const selected = () => {
      if (provider === "OpenAI") return "financeOpenAIAgent";
      if (provider === "xAI") return "financeXAIAgent";
      if (provider === "Ollama") return "financeLocalAgent";
    };

    const agent = mastra.getAgent(
      selected() as
        | "financeOpenAIAgent"
        | "financeXAIAgent"
        | "financeLocalAgent",
    );

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
