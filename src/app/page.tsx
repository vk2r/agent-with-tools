"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MastraMessageV2 } from "@mastra/core";
import { ArrowUpIcon } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { z } from "zod";

// Styles
import "@/components/styles/markdown.css";

// Backend
import { getMemory } from "@/app/actions/chat";

// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

const getMemoryAction = async (
  _previus: MastraMessageV2[],
  formData: FormData
) => {
  const m = await getMemory(formData);
  return m;
};

export function InputGroupDemo() {
  // Schema
  const formSchema = z.object({
    provider: z.string(),
    message: z.string(),
  });

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { provider: "OpenAI", message: "" },
    mode: "onTouched",
  });

  // Streaming state
  const [streamResponse, setStreamResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [memory, memoryAction] = useActionState(getMemoryAction, []);

  const provider = form.watch("provider");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setStreamResponse("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: values.provider,
          message: values.message,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) {
        setIsStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          setStreamResponse(
            (prev) => prev + decoder.decode(value, { stream: true })
          );
        }
      }
    } finally {
      setIsStreaming(false);
      // Refrescar memoria
      const fd = new FormData();
      fd.set("provider", values.provider);
      startTransition(() => {
        memoryAction(fd);
        setStreamResponse("");
        form.setValue("message", "");
      });
    }
  }

  useEffect(() => {
    const fd = new FormData();
    fd.set("provider", provider);
    startTransition(() => {
      memoryAction(fd);
    });
  }, [provider, memoryAction]);

  return (
    <div className="w-full col-span-6 space-y-10">
      {memory && memory.length > 0 && (
        <div className="space-y-3">
          {memory.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className="rounded-md border p-3 m-5 shadow-sm bg-white hover:shadow-xl transition-shadow"
            >
              <div
                className={`text-[11px] font-medium uppercase tracking-wide text-gray-500 ${
                  message.role === "assistant" ? "" : "text-right"
                }`}
              >
                {message.role}
              </div>
              <div
                className={`text-sm p-5 whitespace-pre-line markdown-body ${
                  message.role === "assistant" ? "" : "text-right"
                }`}
              >
                <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}>
                  {message.content.content}
                </Markdown>
              </div>
            </div>
          ))}
        </div>
      )}

      {streamResponse && (
        <div className="rounded-md border p-3 shadow-sm bg-white">
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Assistant
          </div>
          <div className="text-sm whitespace-pre-wrap markdown-body">
            <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}>
              {streamResponse}
            </Markdown>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...form.register("provider")} />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <InputGroupTextarea
                      placeholder="Ask, Search or Chat..."
                      disabled={isStreaming}
                      {...field}
                    />
                    <InputGroupAddon align="block-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <InputGroupButton
                            variant="ghost"
                            disabled={isStreaming}
                          >
                            {form.getValues("provider")}
                          </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="top"
                          align="start"
                          className="[--radius:0.95rem]"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              form.setValue("provider", "OpenAI", {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                            }}
                          >
                            OpenAI
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              form.setValue("provider", "Ollama", {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                            }}
                          >
                            Ollama
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <InputGroupText className="ml-auto">
                        52% used
                      </InputGroupText>
                      <Separator orientation="vertical" className="!h-4" />
                      <InputGroupButton
                        variant="default"
                        className="rounded-full"
                        size="icon-xs"
                        type="submit"
                        disabled={isStreaming}
                      >
                        <ArrowUpIcon />
                        <span className="sr-only">Enviar</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default InputGroupDemo;
