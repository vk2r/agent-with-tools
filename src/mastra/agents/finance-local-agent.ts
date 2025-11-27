/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: Required for template strings */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { createOllama } from "ai-sdk-ollama";
import { formatInTimeZone } from "date-fns-tz";

// Agent libs
import AgentLib from "@/lib/agents";

// MCP
import { financeTools } from "../tools/finance-tool";

// Constants
const agent = AgentLib.GetAgent("Ollama");
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

const ollama = createOllama({ baseURL: agent?.baseURL });

export const financeLocalAgent = new Agent({
  id: "finance-local-agent",
  name: "Finance Local Agent",
  instructions: rulesInstructions,
  model: ollama(agent?.model ?? "", {
    options: {
      num_ctx: agent?.context,
    },
  }),
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
