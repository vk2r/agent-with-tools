import { stepCountIs } from "ai-v5";
import { mastra } from "@/mastra";

function hasAsyncIterator<T>(
  obj: unknown,
): obj is { [Symbol.asyncIterator]: () => AsyncIterator<T> } {
  return (
    typeof (obj as { [Symbol.asyncIterator]?: () => AsyncIterator<T> })[
      Symbol.asyncIterator
    ] === "function"
  );
}

export async function POST(req: Request) {
  try {
    const { providerId, message, threadId } = (await req.json()) as {
      providerId: "OpenAI" | "Ollama";
      message: string;
      threadId: string;
    };

    const resourceId = "user-default";
    const selected =
      providerId === "Ollama" ? "financeLocalAgent" : "financeCloudAgent";

    const agent = mastra.getAgent(selected);

    const result = await agent.stream(message, {
      stopWhen: stepCountIs(5),
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });

    const encoder = new TextEncoder();
    let stream: ReadableStream<Uint8Array>;

    const textStream = result.textStream;

    if (textStream && hasAsyncIterator<string>(textStream)) {
      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of textStream) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    } else {
      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            const full = await result.text;
            controller.enqueue(encoder.encode(full ?? ""));
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
