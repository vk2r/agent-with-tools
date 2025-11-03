"use client";

import type { CoreMessage } from "@mastra/core";
import { useEffect, useRef } from "react";
// Components
import ChatForm from "@/components/molecules/ChatForm";
import Messages from "@/components/organisms/Messages";

// Definitions
export type SubmitValues = { provider: "OpenAI" | "Ollama"; message: string };

export type Props = {
  message: string;
  memory: CoreMessage[];
  stream: string;
  error: string | null;
  isChatDisabled: boolean;
  isStreaming: boolean;
  defaultProvider: "OpenAI" | "Ollama";
  onSubmit: (values: SubmitValues) => void;
  onProviderChange?: (provider: "OpenAI" | "Ollama") => void;
  onStop?: () => void;
};

export default function ThreadChat(props: Props) {
  // Props
  const {
    memory,
    message,
    error,
    stream,
    isStreaming,
    isChatDisabled,
    defaultProvider,
    onSubmit,
    onProviderChange,
    onStop,
  } = props;

  // Constants
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const countMemory =
    memory?.filter((message) => ["assistant", "user"].includes(message.role))
      ?.length ?? 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [memory, stream]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="w-full justify-center bg-slate-100">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3">
          {error}
        </div>
      )}

      <Messages
        messages={memory}
        streamResponse={stream}
        currentMessage={message}
        isStreaming={isStreaming}
      />

      <ChatForm
        fixed
        onStop={onStop}
        onSubmit={onSubmit}
        countMemory={countMemory}
        isStreaming={isStreaming}
        isDisabled={isChatDisabled}
        defaultProvider={defaultProvider}
        onProviderChange={onProviderChange}
      />

      <div ref={bottomRef} />
    </div>
  );
}
