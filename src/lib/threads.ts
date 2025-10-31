import fs from "node:fs/promises";
import path from "node:path";

export type Thread = {
  id: string;
  title: string;
  providerId: "OpenAI" | "Ollama";
  firstMessage: boolean;
};

type Store = {
  threads: Thread[];
};

const STORE_PATH = path.join(process.cwd(), "src", "store", "threads.json");

async function readStore(): Promise<Store> {
  const data = await fs.readFile(STORE_PATH, "utf-8");
  const parsed = JSON.parse(data) as Partial<Store>;
  return {
    threads: Array.isArray(parsed.threads) ? (parsed.threads as Thread[]) : [],
  };
}

async function writeStore(store: Store): Promise<void> {
  const content = `${JSON.stringify(store, null, 2)}\n`;
  await fs.writeFile(STORE_PATH, content, "utf-8");
}

export async function getThreads(): Promise<Thread[]> {
  const store = await readStore();
  return store.threads;
}

export async function getThread(id: string): Promise<Thread | undefined> {
  const store = await readStore();
  return store.threads.find((t) => t.id === id);
}

export async function addThread(thread: Thread): Promise<Thread> {
  const store = await readStore();
  store.threads.push(thread);
  await writeStore(store);
  return thread;
}

export async function removeThread(id: string): Promise<boolean> {
  const store = await readStore();
  const initial = store.threads.length;
  store.threads = store.threads.filter((t) => t.id !== id);
  const changed = store.threads.length !== initial;
  if (changed) await writeStore(store);
  return changed;
}

export async function updateThread(
  id: string,
  updates: Partial<Omit<Thread, "id">>,
): Promise<Thread | undefined> {
  const store = await readStore();
  const idx = store.threads.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const current = store.threads[idx];
  const updated: Thread = { ...current, ...updates, id: current.id };
  store.threads[idx] = updated;
  await writeStore(store);
  return updated;
}
