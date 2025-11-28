"use client";

import type { CoreMessage } from "@mastra/core";
import { useEffect, useRef, useState } from "react";

// Definitions
import type { SubmitValues } from "@/components/organisms/ThreadChat";

// Components
import ThreadChat from "@/components/organisms/ThreadChat";

// Types
import type { Agent } from "@/lib/agents";
import type { Thread } from "@/lib/threads";

// Icons
import { ChartLine } from "../animate-ui/icons/chart-line";

interface Props {
  thread: Thread;
  onProviderChange?: (provider: Agent["displayName"]) => void;
}

export default function ThreadChatContainer(props: Props) {
  // Props
  const { thread, onProviderChange } = props;

  // States
  const [stream, setStream] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [memory, setMemory] = useState([] as CoreMessage[]);

  const abortRef = useRef<AbortController | null>(null);

  // Methods
  const getMemory = async (values: {
    threadId: string;
    providerId: Agent["displayName"];
  }) => {
    try {
      const messages = await fetch("/api/chat/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: values.threadId,
          provider: values.providerId,
        }),
      });

      if (!messages.ok) throw new Error(`HTTP ${messages.status}`);

      const data = await messages.json();
      setMemory(data.messages);
    } catch (error) {
      console.error(error);
      setError("Error al obtener el historial");
    }
  };

  const onSubmit = async (values: {
    provider: Agent["displayName"];
    message: string;
    threadId: string;
    firstMessage: boolean;
  }) => {
    let wasAborted = false;
    try {
      setStream("");
      setIsStreaming(true);
      setCurrentMessage(values.message);

      abortRef.current = new AbortController();

      const agent = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: values.threadId,
          providerId: values.provider,
          message: values.message,
        }),
        signal: abortRef.current.signal,
      });

      if (!agent.ok) throw new Error(`HTTP ${agent.status}`);

      if (values.firstMessage) {
        const update = await fetch("/api/threads/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: values.threadId,
            updates: { firstMessage: false },
          }),
        });

        if (!update.ok) throw new Error(`HTTP ${agent.status}`);
      }

      const reader = agent.body?.getReader();
      if (!reader) throw new Error("Sin lector de stream");

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          setStream(
            (prev: string) => prev + decoder.decode(value, { stream: true }),
          );
        }
      }
    } catch (err: unknown) {
      let name: string | undefined;
      if (typeof err === "object" && err && "name" in err) {
        name = String((err as Record<string, unknown>).name);
      }
      if (name === "AbortError") {
        wasAborted = true;
      } else {
        console.error(err);
        setError("Error al procesar el stream");
      }
    } finally {
      setCurrentMessage("");
      setIsStreaming(false);
      if (!wasAborted) {
        await getMemory({
          threadId: values.threadId,
          providerId: values.provider,
        });
      }
    }
  };

  const stopStreaming = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  useEffect(() => {
    if (!thread) return;

    const run = async () => {
      if (!thread.firstMessage) {
        await getMemory({ threadId: thread.id, providerId: thread.providerId });
        return;
      }

      const key = `firstMessageSent:${thread.id}`;

      try {
        if (typeof window !== "undefined") {
          if (sessionStorage.getItem(key)) return;
          sessionStorage.setItem(key, "1");
        }
      } catch {}

      await onSubmit({
        provider: thread.providerId,
        message: thread.title,
        threadId: thread.id,
        firstMessage: thread.firstMessage,
      });
    };

    run();
  }, [thread.id]);

  return (
    <>
      {!thread.firstMessage && memory.length === 0 && !isStreaming && (
        <ChartLine animate loop size={100} />
      )}
      {(memory.length > 0 || isStreaming) && (
        <ThreadChat
          message={currentMessage}
          memory={memory}
          stream={stream}
          error={error}
          isStreaming={isStreaming}
          isChatDisabled={isStreaming}
          onStop={stopStreaming}
          onProviderChange={onProviderChange}
          defaultProvider={thread.providerId}
          onSubmit={async (values: SubmitValues) => {
            await onSubmit({
              message: values.message,
              provider: values.provider,
              threadId: thread.id,
              firstMessage: false,
            });
          }}
        />
      )}
    </>
  );
}
