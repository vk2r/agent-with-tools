import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import type { InferAgentUIMessage } from "ai";

// Agents
import { financeLocalAgent } from "./agents/finance-local-agent";
import { financeOpenAIAgent } from "./agents/finance-openai-agent";
import { financeXAIAgent } from "./agents/finance-xai-agent";

export type FinanceAgentUIMessage = InferAgentUIMessage<
  typeof financeLocalAgent | typeof financeOpenAIAgent | typeof financeXAIAgent
>;

export const mastra = new Mastra({
  agents: { financeOpenAIAgent, financeXAIAgent, financeLocalAgent },
  storage: new LibSQLStore({
    id: "mastra",
    url: "file:./mastra.db",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
