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
const agent = AgentLib.GetAgent("OpenAI");
const timezone = process.env.TIMEZONE ?? "America/Santiago";
const currentTime = formatInTimeZone(
  new Date(),
  timezone,
  "yyyy-MM-dd HH:mm:ss zzz",
);

if (!agent) throw new Error("Agent for OpenAI not found");

export const financeOpenAIAgent = new Agent({
  id: agent.id,
  name: "Finance OpenAI Agent",
  instructions: getSystemInstructions(currentTime, timezone),
  model: `openai/${agent?.model}`,
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
