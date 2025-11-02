/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: Required for template strings */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { createOllama } from "ai-sdk-ollama";
import { formatInTimeZone } from "date-fns-tz";

// MCP
import { financeTools } from "../tools/finance-tool";

// Environments
const model = process.env.OLLAMA_MODEL ?? "";
const context = Number(process.env.OLLAMA_CONTEXT_WINDOW ?? 65536);
const baseURL = process.env.OLLAMA_ENDPOINT ?? "http://localhost:11434";
const memoryLimit = Number(process.env.OLLAMA_MEMORY_LIMIT ?? "5");

// Constants
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

const ollama = createOllama({ baseURL });

export const financeLocalAgent = new Agent({
  id: "finance-local-agent",
  name: "Finance Local Agent",
  instructions: rulesInstructions,
  model: ollama(model, {
    options: {
      num_ctx: context,
    },
  }),
  tools: await financeTools.getTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./mastra.db",
    }),
    options: {
      lastMessages: memoryLimit,
      threads: {
        generateTitle: true,
      },
    },
  }),
});
