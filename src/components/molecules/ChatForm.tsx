"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UI
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
};

export default function ChatForm(props: Props) {
  // Props
  const {
    isDisabled,
    onSubmit,
    onProviderChange,
    fixed,
    defaultProvider = "OpenAI",
  } = props;

  const formSchema = z.object({
    provider: z.enum(["OpenAI", "Ollama"]),
    message: z.string(),
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { provider: defaultProvider, message: "" },
    mode: "onTouched",
  });

  const provider = form.watch("provider");

  useEffect(() => {
    onProviderChange?.(provider);
  }, [provider, onProviderChange]);

  return (
    <div
      id="chat-form"
      className={
        fixed
          ? "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
          : "w-[50%]"
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await onSubmit(values);
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
                      placeholder="Ask, Search or Chat..."
                      disabled={isDisabled}
                      {...field}
                    />
                    <InputGroupAddon align="block-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <InputGroupButton
                            variant="ghost"
                            disabled={isDisabled}
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
                              onProviderChange?.("OpenAI");
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
                              onProviderChange?.("Ollama");
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
                        disabled={isDisabled}
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
