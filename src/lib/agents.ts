const agents = {
  ollama: {
    memoryLimit: Number(process.env.OLLAMA_MEMORY_LIMIT ?? "5"),
    context: Number(process.env.OLLAMA_CONTEXT ?? "65536"),
  },
  openai: {
    memoryLimit: Number(process.env.OPENAI_MEMORY_LIMIT ?? "20"),
    context: Infinity,
  },
};

const Agent = {
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
