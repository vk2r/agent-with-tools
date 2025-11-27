const agents = {
  ollama: {
    name: "ollama",
    displayName: "Ollama",
    memoryLimit: Number(process.env.OLLAMA_MEMORY_LIMIT ?? 5),
    context: Number(process.env.OLLAMA_CONTEXT ?? 65536),
    enable: Number(process.env.OLLAMA_ENABLE ?? 0),
  },
  openai: {
    name: "openai",
    displayName: "OpenAI",
    memoryLimit: Number(process.env.OPENAI_MEMORY_LIMIT ?? 10),
    context: Infinity,
    enable: Number(process.env.OPENAI_ENABLE ?? 0),
  },
  xai: {
    name: "xai",
    displayName: "xAI",
    memoryLimit: Number(process.env.XAI_MEMORY_LIMIT ?? 10),
    context: Infinity,
    enable: Number(process.env.XAI_ENABLE ?? 0),
  },
};

const Agent = {
  GetEnabledAgents: () => {
    return Object.values(agents).filter((agent) => agent.enable === 1);
  },
  GetAgent: (agent: keyof typeof agents) => {
    return agents[agent];
  },
  GetMemoryLimit: (agent: keyof typeof agents) => {
    return agents[agent].memoryLimit;
  },
  GetContext: (agent: keyof typeof agents) => {
    return agents[agent]?.context;
  },
};

export default Agent;
