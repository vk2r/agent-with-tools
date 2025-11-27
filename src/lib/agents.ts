// Definitions
export type Agent = {
  name: string;
  displayName: string;
  memoryLimit: number;
  context: number;
  enable: number;
};

const agents: Agent[] = [
  {
    name: "ollama",
    displayName: "Ollama",
    memoryLimit: Number(process.env.OLLAMA_MEMORY_LIMIT ?? 5),
    context: Number(process.env.OLLAMA_CONTEXT ?? 65536),
    enable: Number(process.env.OLLAMA_ENABLE ?? 0),
  },
  {
    name: "openai",
    displayName: "OpenAI",
    memoryLimit: Number(process.env.OPENAI_MEMORY_LIMIT ?? 10),
    context: Infinity,
    enable: Number(process.env.OPENAI_ENABLE ?? 0),
  },
  {
    name: "xai",
    displayName: "xAI",
    memoryLimit: Number(process.env.XAI_MEMORY_LIMIT ?? 10),
    context: Infinity,
    enable: Number(process.env.XAI_ENABLE ?? 0),
  },
];

const Agent = {
  GetEnabledAgents: () => {
    return Object.values(agents).filter((agent) => agent.enable === 1);
  },
  GetAgent: (name: Agent["name"]) => {
    return agents.find((agent) => agent.name === name);
  },
  GetMemoryLimit: (name: Agent["name"]) => {
    return agents.find((agent) => agent.name === name)?.memoryLimit;
  },
  GetContext: (name: Agent["name"]) => {
    return agents.find((agent) => agent.name === name)?.context;
  },
  IsEnabled: (name: Agent["name"]) => {
    return agents.some((agent) => agent.name === name && agent.enable === 1);
  },
};

export default Agent;
