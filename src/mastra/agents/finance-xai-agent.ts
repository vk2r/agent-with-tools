/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: Required for template strings */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { formatInTimeZone } from "date-fns-tz";

// Agent libs
import AgentLib from "@/lib/agents";

// MCP
import { financeTools } from "../tools/finance-tool";

// Constants
const agent = AgentLib.GetAgent("xAI");
const timezone = process.env.TIMEZONE ?? "America/Santiago";
const currentTime = formatInTimeZone(
  new Date(),
  timezone,
  "yyyy-MM-dd HH:mm:ss zzz",
);

const rulesPath = join(process.cwd(), "src", "mastra", "agents", "system.md");
const rulesRaw = readFileSync(rulesPath, "utf-8");
const rulesInstructions = rulesRaw
  .replaceAll("${currentTime.toString()}", currentTime.toString())
  .replaceAll("${timezone}", timezone);

export const financeXAIAgent = new Agent({
  id: "finance-xai-agent",
  name: "Finance xAI Agent",
  instructions: rulesInstructions,
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
