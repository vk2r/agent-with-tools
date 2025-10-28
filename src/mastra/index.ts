import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

// Agents
import { financeCloudAgent } from "./agents/finance-cloud-agent";
import { financeLocalAgent } from "./agents/finance-local-agent";

export const mastra = new Mastra({
  agents: { financeCloudAgent, financeLocalAgent },
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
