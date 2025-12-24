// Definitions
export type Agent = {
  name: "ollama" | "openai" | "xai";
  displayName: "Ollama" | "OpenAI" | "xAI";
  agentName: "financeLocalAgent" | "financeOpenAIAgent" | "financeXAIAgent";
  id: "finance-local-agent" | "finance-openai-agent" | "finance-xai-agent";
  reasoningEffort?: false | "low" | "medium" | "high";
  memoryLimit: number;
  context: number;
  enable: boolean;
  model?: string;
  baseURL?: string;
  default?: boolean;
};

const agents: Agent[] = [
  {
    name: "ollama",
    displayName: "Ollama",
    agentName: "financeLocalAgent",
    id: "finance-local-agent",
    model: process.env.OLLAMA_MODEL ?? process.env.NEXT_PUBLIC_OLLAMA_MODEL,
    baseURL:
      process.env.OLLAMA_ENDPOINT ?? process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT,
    memoryLimit: Number(
      process.env.OLLAMA_MEMORY_LIMIT ??
        process.env.NEXT_PUBLIC_OLLAMA_MEMORY_LIMIT,
    ),
    context: Number(
      process.env.OLLAMA_CONTEXT ?? process.env.NEXT_PUBLIC_OLLAMA_CONTEXT,
    ),
    enable:
      Number(
        process.env.OLLAMA_ENABLE ?? process.env.NEXT_PUBLIC_OLLAMA_ENABLE,
      ) === 1,
    default:
      Number(
        process.env.OLLAMA_DEFAULT_MODEL ??
          process.env.NEXT_PUBLIC_OLLAMA_DEFAULT_MODEL,
      ) === 1,
  },
  {
    name: "openai",
    displayName: "OpenAI",
    agentName: "financeOpenAIAgent",
    id: "finance-openai-agent",
    reasoningEffort: "low",
    model: process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL,
    memoryLimit: Number(
      process.env.OPENAI_MEMORY_LIMIT ??
        process.env.NEXT_PUBLIC_OPENAI_MEMORY_LIMIT,
    ),
    context: Infinity,
    enable:
      Number(
        process.env.OPENAI_ENABLE ?? process.env.NEXT_PUBLIC_OPENAI_ENABLE,
      ) === 1,
    default:
      Number(
        process.env.OPENAI_DEFAULT_MODEL ??
          process.env.NEXT_PUBLIC_OPENAI_DEFAULT_MODEL,
      ) === 1,
  },
  {
    name: "xai",
    displayName: "xAI",
    agentName: "financeXAIAgent",
    id: "finance-xai-agent",
    model: process.env.XAI_MODEL ?? process.env.NEXT_PUBLIC_XAI_MODEL,
    memoryLimit: Number(
      process.env.XAI_MEMORY_LIMIT ?? process.env.NEXT_PUBLIC_XAI_MEMORY_LIMIT,
    ),
    context: Infinity,
    enable:
      Number(process.env.XAI_ENABLE ?? process.env.NEXT_PUBLIC_XAI_ENABLE) ===
      1,
    default:
      Number(
        process.env.XAI_DEFAULT_MODEL ??
          process.env.NEXT_PUBLIC_XAI_DEFAULT_MODEL,
      ) === 1,
  },
];

const Agent = {
  GetEnabledAgents: () => {
    return Object.values(agents).filter((agent) => agent.enable);
  },
  GetEnabledAgentList: () => {
    return Object.values(agents)
      .filter((agent) => agent.enable)
      .flatMap((agent) => agent.displayName);
  },
  GetDefaultAgent: () => {
    return Object.values(agents).find((agent) => agent.default)?.displayName;
  },
  GetAgent: (displayName: Agent["displayName"]) => {
    return agents.find((agent) => agent.displayName === displayName);
  },
  GetMemoryLimit: (name: Agent["name"]) => {
    return agents.find((agent) => agent.name === name)?.memoryLimit;
  },
  GetContext: (name: Agent["name"]) => {
    return agents.find((agent) => agent.name === name)?.context;
  },
  IsEnabled: (displayName: Agent["displayName"]) => {
    return agents.some(
      (agent) => agent.displayName === displayName && agent.enable,
    );
  },
};

export default Agent;
