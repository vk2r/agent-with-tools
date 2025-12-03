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

export const financeOpenAIAgent = new Agent({
  id: "finance-openai-agent",
  name: "Finance OpenAI Agent",
  instructions: getSystemInstructions(currentTime, timezone),
  model: `openai/${agent?.model}`,
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
