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
      savePerStep: true,
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });

    const encoder = new TextEncoder();
    let stream: ReadableStream<Uint8Array>;

    const textStream = result.textStream;
    const { signal } = req;
    const abortPromise = new Promise<"aborted">((resolve) => {
      if (signal.aborted) {
        resolve("aborted");
      } else {
        signal.addEventListener(
          "abort",
          () => {
            resolve("aborted");
          },
          { once: true },
        );
      }
    });

    if (textStream && hasAsyncIterator<string>(textStream)) {
      const iterator = textStream[
        Symbol.asyncIterator
      ]() as AsyncIterator<string> & { return?: () => unknown };
      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          let aborted = false;
          const onAbort = () => {
            aborted = true;
            try {
              controller.close();
            } catch {}
            try {
              iterator.return?.();
            } catch {}
          };
          if (signal.aborted) onAbort();
          else signal.addEventListener("abort", onAbort, { once: true });
          try {
            while (!aborted) {
              const raced = (await Promise.race([
                iterator.next() as Promise<IteratorResult<string>>,
                abortPromise,
              ])) as IteratorResult<string> | "aborted";
              if (raced === "aborted") break;
              const { value, done } = raced as IteratorResult<string>;
              if (done) break;
              if (value) {
                controller.enqueue(encoder.encode(value));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
        cancel() {
          try {
            iterator.return?.();
          } catch {}
        },
      });
    } else {
      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            const raced = (await Promise.race([
              result.text as Promise<string | undefined>,
              abortPromise,
            ])) as string | undefined | "aborted";
            if (raced !== "aborted") {
              const full = raced as string | undefined;
              controller.enqueue(encoder.encode(full ?? ""));
            }
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
