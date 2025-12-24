"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

// Definitions
import { useEffect } from "react";
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
  initialMessages?: UIMessage[];
  onProviderChange?: (provider: Agent["displayName"]) => void;
}

export default function ThreadChatContainer(props: Props) {
  // Props
  const { thread, initialMessages, onProviderChange } = props;

  // Hooks
  const { messages, status, error, sendMessage, stop } = useChat({
    id: thread.id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat/create",
    }),
  });

  const isReady = messages.length > 0 || ["streaming"].includes(status);
  const isStreaming = ["submitted", "streaming"].includes(status);

  const handleSubmit = async (values: SubmitValues) => {
    sendMessage(
      { text: values.message },
      {
        body: {
          threadId: thread.id,
          providerId: values.provider,
        },
      },
    );
  };

  useEffect(() => {
    if (thread.firstMessage) {
      sendMessage(
        { text: thread.title },
        {
          body: {
            threadId: thread.id,
            providerId: thread.providerId,
            firstMessage: thread.firstMessage,
          },
        },
      );
    }
  }, []);

  return (
    <>
      {!isReady && <ChartLine animate loop size={100} />}
      {isReady && (
        <ThreadChat
          messages={messages}
          error={error?.message ?? null}
          isStreaming={isStreaming}
          isChatDisabled={isStreaming}
          onStop={stop}
          onProviderChange={onProviderChange}
          defaultProvider={thread.providerId}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
