/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: Required for template strings */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { formatInTimeZone } from "date-fns-tz";

// MCP
import { financeTools } from "../tools/finance-tool";

// Environments
const model = process.env.OPENAI_MODEL ?? "";
const memoryLimt = Number(process.env.OPENAI_MEMORY_LIMIT ?? "20");

// Constants
const timezone = process.env.NEXT_PUBLIC_TIMEZONE ?? "America/Santiago";
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

export const financeCloudAgent = new Agent({
  id: "finance-cloud-agent",
  name: "Finance Cloud Agent",
  instructions: rulesInstructions,
  model: `openai/${model}`,
  tools: await financeTools.getTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./mastra.db",
    }),
    options: {
      lastMessages: memoryLimt,
      threads: {
        generateTitle: true,
      },
    },
  }),
});
