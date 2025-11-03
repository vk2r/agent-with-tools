"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Pause, Loader } from "lucide-react";
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

import { cx } from "class-variance-authority";

// Definitions
export type OnSubmitProps = {
  provider: "OpenAI" | "Ollama";
  message: string;
};

export type Props = {
  fixed?: boolean;
  isDisabled: boolean;
  onSubmit: (values: OnSubmitProps) => Promise<void> | void;
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

  const form = useForm<OnSubmitProps>({
    resolver: zodResolver(formSchema),
    defaultValues: { provider: defaultProvider, message: "" },
    mode: "onSubmit",
  });

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
                    className={cx(
                      "transition-shadow",
                      fixed ? "shadow-xl" : "hover:shadow-xl",
                      isStreaming ? "bg-slate-50" : "bg-white dark:bg-white",
                    )}
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
                        <DropdownMenuTrigger disabled={isStreaming} asChild>
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
                            {!isStreaming && (
                              <Badge variant="secondary">
                                <div className="flex items-center justify-center gap-2">
                                  {calculateCurrentMemory(countMemory)} /{" "}
                                  {form.getValues("provider") === "OpenAI"
                                    ? Agent.GetMemoryLimit("openai")
                                    : Agent.GetMemoryLimit("ollama")}
                                  <Brain size={14} />
                                </div>
                              </Badge>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Finantier recordará los ultimos{" "}
                              {calculateCurrentMemory(countMemory)} mensajes
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </InputGroupText>

                      {isStreaming && (
                        <Badge
                          variant="default"
                          className="rounded-sm p-1 px-2"
                        >
                          <div className="flex items-center justify-center gap-2">
                            Desarrollando
                            <Loader className="animate-spin size-3" />
                          </div>
                        </Badge>
                      )}

                      <Separator orientation="vertical" className="!h-4" />
                      {isStreaming && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={onStop}
                        >
                          <Pause size={15} />
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
