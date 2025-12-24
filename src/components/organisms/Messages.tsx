/** biome-ignore-all lint/suspicious/noArrayIndexKey: index needed for message list keys */
"use client";

import type { UIMessage } from "@ai-sdk/react";
import ChatMessage from "@/components/molecules/ChatMessage";

type Props = {
  messages: UIMessage[];
  isStreaming?: boolean;
};

export default function Messages(props: Props) {
  // Props
  const { messages, isStreaming } = props;

  return (
    <div className="w-full mx-auto max-w-5xl space-y-10">
      {messages?.length > 0 && (
        <div className="space-y-3">
          {messages.map((message, index) => {
            if (!["user", "assistant"].includes(message.role)) return null;
            return message.parts.map((part) => {
              switch (part.type) {
                case "text":
                  return (
                    <ChatMessage
                      key={`${message.role}-${index}-${message.id}`}
                      author={message.role as "user" | "assistant"}
                      content={part.text}
                    />
                  );
                default:
                  return null;
              }
            });
          })}
        </div>
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
