import { removeThread } from "@/lib/threads";
import { mastra } from "@/mastra";

export async function POST(req: Request) {
  try {
    const { threadIds } = (await req.json()) as {
      threadIds?: string[];
    };

    const wantsDelete = Array.isArray(threadIds) && threadIds.length > 0;

    if (!wantsDelete) {
      return new Response(
        "Faltan parámetros: threadId o (provider y threadIds (array de strings))",
        { status: 400 },
      );
    }

    if (Array.isArray(threadIds) && threadIds.length > 0) {
      for (const id of threadIds) {
        const removed = await removeThread(id);
        if (!removed) {
          return new Response("Thread no encontrado", { status: 404 });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
