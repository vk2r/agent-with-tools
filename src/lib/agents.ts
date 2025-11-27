// Definitions
export type Agent = {
  name: "ollama" | "openai" | "xai";
  displayName: "Ollama" | "OpenAI" | "xAI";
  agentName: "financeLocalAgent" | "financeOpenAIAgent" | "financeXAIAgent";
  memoryLimit: number;
  context: number;
  enable: boolean;
  model?: string;
  baseURL?: string;
};

const agents: Agent[] = [
  {
    name: "ollama",
    displayName: "Ollama",
    agentName: "financeLocalAgent",
    model: process.env.OLLAMA_MODEL ?? "",
    baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    memoryLimit: Number(process.env.OLLAMA_MEMORY_LIMIT ?? 5),
    context: Number(process.env.OLLAMA_CONTEXT ?? 65536),
    enable: Number(process.env.OLLAMA_ENABLE ?? 0) === 1,
  },
  {
    name: "openai",
    displayName: "OpenAI",
    agentName: "financeOpenAIAgent",
    model: process.env.OPENAI_MODEL ?? "",
    memoryLimit: Number(process.env.OPENAI_MEMORY_LIMIT ?? 10),
    context: Infinity,
    enable: Number(process.env.OPENAI_ENABLE ?? 0) === 1,
  },
  {
    name: "xai",
    displayName: "xAI",
    agentName: "financeXAIAgent",
    model: process.env.XAI_MODEL ?? "",
    memoryLimit: Number(process.env.XAI_MEMORY_LIMIT ?? 10),
    context: Infinity,
    enable: Number(process.env.XAI_ENABLE ?? 0) === 1,
  },
];

const Agent = {
  GetEnabledAgents: () => {
    return Object.values(agents).filter((agent) => agent.enable);
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
