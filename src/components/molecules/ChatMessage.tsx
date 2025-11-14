/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import rehypeMathml from "@daiji256/rehype-mathml";
import { Landmark } from "lucide-react";
import Markdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

// Styles
import "@/components/styles/markdown.css";
import "@/components/styles/latex.css";

// Components
import { UserIcon } from "@/components/animate-ui/icons/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Definitions
export type ChatMessageProps = {
  author: string;
  content?: string;
};

export function ChatMessage({ author, content }: ChatMessageProps) {
  return (
    <div className="w-full">
      {author === "user" && (
        <div className="flex justify-end my-8 px-8 gap-8">
          <div className="flex items-center justify-center w-full">
            <Separator className="w-full" />
          </div>
          <div className="w-fit max-w-full bg-slate-700 border rounded-sm lg:rounded-lg px-5 overflow-clip">
            <div className="flex items-start lg:items-center gap-3 p-5">
              <div className="text-sm markdown-body w-max bg-slate-700! text-white!">
                <Markdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                  remarkPlugins={[
                    remarkGfm,
                    remarkRehype,
                    remarkParse,
                    remarkEmoji,
                    rehypeMathml,
                  ]}
                >
                  {content}
                </Markdown>
              </div>
              <div className="flex justify-start items-start lg:items-center gap-2 font-semibold text-white">
                <Avatar className="text-slate-700 bg-white">
                  <AvatarFallback className="bg-white">
                    <UserIcon animateOnHover size={18} />
                  </AvatarFallback>
                  <AvatarImage src="/#" alt="@shadcn" />
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      )}

      {author === "assistant" && (
        <div className="rounded-md border p-3 m-5 bg-white hover:shadow-lg">
          <div className="tracking-wide">
            <div className="flex justify-start items-center gap-2 p-2 font-semibold">
              <Avatar className="text-white">
                <AvatarFallback className="bg-slate-700">
                  <Landmark className="size-4" />
                </AvatarFallback>
                <AvatarImage src="/#" alt="@shadcn" />
              </Avatar>
              Finantier
            </div>
          </div>
          <div className="text-sm p-5 markdown-body bg-white">
            <Markdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
              remarkPlugins={[
                remarkGfm,
                remarkRehype,
                remarkParse,
                remarkEmoji,
                rehypeMathml,
              ]}
            >
              {content}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
