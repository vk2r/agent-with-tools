import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import { Brain, Loader, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Icons
import { ArrowUpIcon } from "@/components/ui/arrow-up";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

import AgentLib, { type Agent } from "@/lib/agents";

// Definitions
export type OnSubmitProps = {
  provider: Agent["displayName"];
  message: string;
};

export type Props = {
  fixed?: boolean;
  isDisabled: boolean;
  onSubmit: (values: OnSubmitProps) => Promise<void> | void;
  onProviderChange?: (provider: Agent["displayName"]) => void;
  defaultProvider?: Agent["displayName"];
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
    defaultProvider,
    onProviderChange,
  } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const enabledAgentList = AgentLib.GetEnabledAgentList();
  const formSchema = z.object({
    provider: z.enum(enabledAgentList),
    message: z.string().min(1),
  });

  // States
  const form = useForm<OnSubmitProps>({
    resolver: zodResolver(formSchema),
    defaultValues: { provider: defaultProvider, message: "" },
    mode: "onSubmit",
  });

  const [memory, setMemory] = useState({ current: 0, limit: 0 });

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

  const calculateMemory = (count = 0) => {
    const agent = AgentLib.GetAgent(form.getValues("provider"));
    const limit = agent?.memoryLimit ?? 0;
    const current = Math.min(count, limit);
    setMemory({ current, limit });
  };

  // Effects
  useEffect(() => {
    if (!isDisabled) textAreaRef.current?.focus();
  }, [isDisabled]);

  useEffect(() => {
    calculateMemory(countMemory);
  }, [form.getValues("provider"), countMemory]);

  return (
    <div
      id="chat-form"
      className={
        fixed
          ? "px-4 md:px-0 sticky my-0 inset-x-0 bottom-6 mx-auto z-50 max-w-3xl"
          : "w-full mx-6 lg:w-2/5 lg:mx-auto"
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
                          {enabledAgentList.map((agent) => (
                            <DropdownMenuItem
                              key={agent}
                              className="cursor-pointer"
                              onClick={() => {
                                form.setValue("provider", agent, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                  shouldTouch: true,
                                });
                                onProviderChange?.(agent);
                              }}
                            >
                              {agent}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <InputGroupText className="ml-auto">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {!isStreaming && (
                              <Badge variant="secondary">
                                <div className="flex items-center justify-center gap-2">
                                  {`${memory.current.toString().padStart(2, "0").replace("00", "0")} / ${memory.limit.toString().padStart(2, "0")}`}
                                  <Brain size={14} />
                                </div>
                              </Badge>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {`Finantier recordará los ultimos ${memory.current} mensajes`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </InputGroupText>

                      {isStreaming && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="default"
                              className="rounded-sm p-1 px-2"
                            >
                              <div className="flex items-center justify-center gap-2">
                                Desarrollando
                                <Loader className="animate-spin size-3" />
                              </div>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>
                              Finantier esta consultando multiples fuentes para
                              desarrollar una mejor respuesta
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <Separator orientation="vertical" className="!h-4" />
                      {isStreaming && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer flex flex-row gap-2 justify-center items-center"
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
