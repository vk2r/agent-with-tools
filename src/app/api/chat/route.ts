import { mastra } from "@/mastra";

function hasAsyncIterator<T>(
  obj: unknown
): obj is { [Symbol.asyncIterator]: () => AsyncIterator<T> } {
  return (
    typeof (obj as { [Symbol.asyncIterator]?: () => AsyncIterator<T> })[
      Symbol.asyncIterator
    ] === "function"
  );
}

export async function POST(req: Request) {
  const { provider, message } = (await req.json()) as {
    provider: "OpenAI" | "Ollama";
    message: string;
  };

  const selected =
    provider === "OpenAI" ? "financeCloudAgent" : "financeLocalAgent";
  const agent = mastra.getAgent(selected);

  const result = await agent.stream(message, {
    memory: {
      thread: "user-123",
      resource: "test-123",
    },
  });

  const encoder = new TextEncoder();
  let stream: ReadableStream<Uint8Array>;

  // Preferir textStream si está disponible; de lo contrario, enviar el texto completo
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
}
