"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Brain } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Icons
import { BotIcon } from "@/components/animate-ui/icons/bot";
import { ArrowUpIcon } from "@/components/ui/arrow-up";
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Agent from "@/lib/agents";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// Definitions
type ChatFormValues = {
  provider: "OpenAI" | "Ollama";
  message: string;
};

type Props = {
  fixed?: boolean;
  isDisabled: boolean;
  onSubmit: (values: ChatFormValues) => Promise<void> | void;
  onProviderChange?: (provider: "OpenAI" | "Ollama") => void;
  defaultProvider?: "OpenAI" | "Ollama";
  isStreaming?: boolean;
  countMemory?: number;
  onStop?: () => void;
};

export default function ChatForm(props: Props) {
  // Props
  const {
    fixed,
    isDisabled,
    isStreaming,
    countMemory,
    onStop,
    onSubmit,
    onProviderChange,
    defaultProvider = "OpenAI",
  } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const formSchema = z.object({
    provider: z.enum(["OpenAI", "Ollama"]),
    message: z.string().min(1),
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { provider: defaultProvider, message: "" },
    mode: "onSubmit",
  });

  const provider = form.watch("provider");

  // Methods
  const handleUserKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
      form.resetField("message");
    }
  };

  const calculateCurrentMemory = (current = 0) => {
    const limit =
      form.getValues("provider") === "OpenAI"
        ? Agent.GetMemoryLimit("openai")
        : Agent.GetMemoryLimit("ollama");
    return Math.min(current, limit);
  };

  // Effects
  useEffect(() => {
    onProviderChange?.(provider);
  }, [provider, onProviderChange]);

  useEffect(() => {
    if (!isDisabled) textAreaRef.current?.focus();
  }, [isDisabled]);

  return (
    <div
      id="chat-form"
      className={
        fixed
          ? "px-4 md:px-0 sticky my-0 inset-x-0 bottom-6 mx-auto z-50 max-w-3xl bg-slate-100"
          : "w-full mx-6 lg:w-2/5 lg:mx-auto bg-slate-100"
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            try {
              if (isDisabled) onStop?.();
              else await onSubmit(values);
            } finally {
              form.setValue("message", "");
            }
          })}
          className="space-y-4"
        >
          <input type="hidden" {...form.register("provider")} />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup
                    className={`bg-white dark:bg-white  transition-shadow ${fixed ? "shadow-xl" : "hover:shadow-xl"}`}
                  >
                    <InputGroupTextarea
                      placeholder="Pregunta sobre finanzas ..."
                      disabled={isDisabled}
                      onKeyUp={handleUserKeyPress}
                      {...field}
                      ref={textAreaRef}
                    />
                    <InputGroupAddon align="block-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <InputGroupButton
                            variant="ghost"
                            className="cursor-pointer"
                          >
                            {form.getValues("provider")}
                          </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="top"
                          align="start"
                          className="[--radius:0.95rem]"
                        >
                          <DropdownMenuLabel>Proveedor</DropdownMenuLabel>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              form.setValue("provider", "OpenAI", {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                              onProviderChange?.("OpenAI");
                            }}
                          >
                            OpenAI
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              form.setValue("provider", "Ollama", {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                              onProviderChange?.("Ollama");
                            }}
                          >
                            Ollama
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <InputGroupText className="ml-auto">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary">
                              <div className="flex items-center justify-center gap-2">
                                {calculateCurrentMemory(countMemory)} /{" "}
                                {form.getValues("provider") === "OpenAI"
                                  ? Agent.GetMemoryLimit("openai")
                                  : Agent.GetMemoryLimit("ollama")}
                                <Brain size={14} />
                              </div>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Finantier recordará los ultimos{" "}
                              {calculateCurrentMemory(countMemory)} mensajes
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </InputGroupText>
                      <Separator orientation="vertical" className="!h-4" />
                      {isStreaming && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={onStop}
                        >
                          <BotIcon animate loop />
                          Parar
                        </Button>
                      )}
                      {!isStreaming && (
                        <InputGroupButton
                          variant="default"
                          className="rounded-full cursor-pointer"
                          size="icon-xs"
                          disabled={isDisabled}
                          type="submit"
                        >
                          <ArrowUpIcon />
                          <span className="sr-only">Enviar</span>
                        </InputGroupButton>
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
