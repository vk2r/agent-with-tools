"use client";

import type { CoreMessage } from "@mastra/core";

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
  } = props;

  return (
    <div className="w-1/3 mx-auto space-y-10 mb-[100px]">
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
        isDisabled={isChatDisabled}
        onSubmit={onSubmit}
        defaultProvider={defaultProvider}
      />
    </div>
  );
}
