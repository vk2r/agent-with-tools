import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

// Agents
import { financeLocalAgent } from "./agents/finance-local-agent";
import { financeOpenAIAgent } from "./agents/finance-openai-agent";
import { financeXAIAgent } from "./agents/finance-xai-agent";

export const mastra = new Mastra({
  agents: { financeOpenAIAgent, financeXAIAgent, financeLocalAgent },
  storage: new LibSQLStore({
    url: "file:./mastra.db",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  telemetry: {
    enabled: false,
  },
  observability: {
    default: { enabled: false },
  },
});
