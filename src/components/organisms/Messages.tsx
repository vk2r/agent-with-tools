/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import type { CoreMessage } from "@mastra/core";
import { Fragment } from "react";
import ChatMessage from "@/components/molecules/ChatMessage";

type Props = {
  messages: CoreMessage[];
  streamResponse?: string;
  isStreaming?: boolean;
  currentMessage?: string;
};

export default function Messages(props: Props) {
  // Props
  const { messages, streamResponse, isStreaming, currentMessage } = props;

  return (
    <div className="w-full mx-auto max-w-[1024px] mx-auto space-y-10">
      {messages?.length > 0 && (
        <div className="space-y-3">
          {messages.map((message, index) => (
            <Fragment key={`current-list-${index}`}>
              {["user", "assistant"].includes(message.role) &&
                typeof message.content === "string" &&
                message.content && (
                  <ChatMessage
                    key={`${message.role}-${index}-${message.content}`}
                    author={message.role}
                    content={
                      typeof message.content === "string" ? message.content : ""
                    }
                  />
                )}
            </Fragment>
          ))}
        </div>
      )}

      {currentMessage && isStreaming && (
        <ChatMessage author="user" content={currentMessage} />
      )}

      {streamResponse && isStreaming && (
        <ChatMessage
          author="assistant"
          content={streamResponse ?? "Analizando ..."}
        />
      )}

      {messages?.length > 0 && !isStreaming && (
        <div className="w-full text-center text-xs text-gray-500 -mt-6 mb-6 px-6">
          Finantier no es perfecto y puede cometer errores. Considera verificar
          la información importante.
        </div>
      )}
    </div>
  );
}
