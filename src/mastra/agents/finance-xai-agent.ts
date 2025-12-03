import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { formatInTimeZone } from "date-fns-tz";

// Agent libs
import AgentLib from "@/lib/agents";

// MCP
import { financeTools } from "../tools/finance-tool";
import { getSystemInstructions } from "./system-instructions";

// Constants
const agent = AgentLib.GetAgent("xAI");
const timezone = process.env.TIMEZONE ?? "America/Santiago";
const currentTime = formatInTimeZone(
  new Date(),
  timezone,
  "yyyy-MM-dd HH:mm:ss zzz",
);

export const financeXAIAgent = new Agent({
  id: "finance-xai-agent",
  name: "Finance xAI Agent",
  instructions: getSystemInstructions(currentTime, timezone),
  model: `xai/${agent?.model}`,
  tools: await financeTools.getTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./mastra.db",
    }),
    options: {
      lastMessages: agent?.memoryLimit,
      threads: {
        generateTitle: true,
      },
    },
  }),
});
