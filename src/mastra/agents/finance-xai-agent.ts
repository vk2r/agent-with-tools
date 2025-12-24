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

if (!agent) throw new Error("Agent for xAI not found");

export const financeXAIAgent = new Agent({
  id: agent.id,
  name: "Finance xAI Agent",
  instructions: getSystemInstructions(currentTime, timezone),
  model: `xai/${agent?.model}`,
  tools: await financeTools.listTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      id: agent.id,
      url: "file:./mastra.db",
    }),
    options: {
      lastMessages: agent.memoryLimit,
      generateTitle: true,
    },
  }),
});
