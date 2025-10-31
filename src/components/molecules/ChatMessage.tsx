import Markdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "@/components/styles/markdown.css";

export type ChatMessageProps = {
  author: string;
  content?: string;
};

export function ChatMessage({ author, content }: ChatMessageProps) {
  const isAssistant = author === "assistant";

  return (
    <div className="rounded-md border p-3 m-5 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div
        className={`text-[11px] font-medium uppercase tracking-wide text-gray-500 ${isAssistant ? "" : "text-right"}`}
      >
        {author}
      </div>
      <div
        className={`text-sm p-5 whitespace-pre-line markdown-body ${isAssistant ? "" : "text-right"}`}
      >
        <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}>
          {content}
        </Markdown>
      </div>
    </div>
  );
}

export default ChatMessage;
