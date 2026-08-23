import type { Category, Prompt } from "@/lib/types";

type Store = { categories: Category[]; prompts: Prompt[] };
const STORAGE_KEY = "ti-graphics-prompt-manager:v1";
const DEFAULT_STORE: Store = {
  categories: [
    { id: 1, name: "Jersey Mockup", thumbnail: null, promptCount: 0, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
    { id: 2, name: "Logo Mockup", thumbnail: null, promptCount: 0, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
    { id: 3, name: "Personal Photo", thumbnail: null, promptCount: 0, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  ],
  prompts: [],
};

function cloneStore(store: Store): Store {
  return { categories: store.categories.map((category) => ({ ...category })), prompts: store.prompts.map((prompt) => ({ ...prompt })) };
}

function readStore(): Store {
  if (typeof window === "undefined") return cloneStore(DEFAULT_STORE);
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const initial = cloneStore(DEFAULT_STORE);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(saved) as Partial<Store>;
    return { categories: Array.isArray(parsed.categories) ? parsed.categories : [], prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [] } as Store;
  } catch {
    return cloneStore(DEFAULT_STORE);
  }
}

function writeStore(store: Store) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
function now() { return new Date().toISOString(); }
function nextId(items: Array<{ id: number }>) { return items.reduce((max, item) => Math.max(max, item.id), 0) + 1; }
function ensureText(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(message);
  return value.trim();
}
function withPromptCounts(store: Store): Store {
  const counts = new Map<number, number>();
  for (const prompt of store.prompts) counts.set(prompt.categoryId, (counts.get(prompt.categoryId) ?? 0) + 1);
  return { ...store, categories: store.categories.map((category) => ({ ...category, promptCount: counts.get(category.id) ?? 0 })) };
}

export const api = {
  categories: {
    list: async () => {
      const store = withPromptCounts(readStore());
      writeStore(store);
      return { categories: [...store.categories].sort((a, b) => b.id - a.id) };
    },
    get: async (id: number | string) => {
      const category = withPromptCounts(readStore()).categories.find((item) => item.id === Number(id));
      if (!category) throw new Error("Category not found.");
      return { category };
    },
    create: async (payload: { name: string; thumbnail: string | null }) => {
      const store = readStore();
      const timestamp = now();
      const category: Category = { id: nextId(store.categories), name: ensureText(payload.name, "Category name is required."), thumbnail: payload.thumbnail || null, promptCount: 0, createdAt: timestamp, updatedAt: timestamp };
      store.categories.unshift(category);
      writeStore(store);
      return { category };
    },
    update: async (id: number | string, payload: Partial<{ name: string; thumbnail: string | null }>) => {
      const store = readStore();
      const category = store.categories.find((item) => item.id === Number(id));
      if (!category) throw new Error("Category not found.");
      if (payload.name !== undefined) category.name = ensureText(payload.name, "Category name is required.");
      if (payload.thumbnail !== undefined) category.thumbnail = payload.thumbnail || null;
      category.updatedAt = now();
      const updated = withPromptCounts(store);
      writeStore(updated);
      return { category: updated.categories.find((item) => item.id === category.id)! };
    },
    remove: async (id: number | string) => {
      const store = readStore();
      const categoryId = Number(id);
      if (!store.categories.some((item) => item.id === categoryId)) throw new Error("Category not found.");
      store.categories = store.categories.filter((item) => item.id !== categoryId);
      store.prompts = store.prompts.filter((item) => item.categoryId !== categoryId);
      writeStore(store);
      return { ok: true as const };
    },
  },
  prompts: {
    list: async (params: { categoryId?: number | string; search?: string }) => {
      const store = readStore();
      const query = params.search?.trim().toLowerCase();
      const prompts = store.prompts.filter((prompt) => (params.categoryId === undefined || prompt.categoryId === Number(params.categoryId)) && (!query || prompt.promptText.toLowerCase().includes(query)));
      return { prompts: prompts.sort((a, b) => b.id - a.id) };
    },
    get: async (id: number | string) => {
      const prompt = readStore().prompts.find((item) => item.id === Number(id));
      if (!prompt) throw new Error("Prompt not found.");
      return { prompt };
    },
    create: async (payload: { categoryId: number; thumbnail: string | null; promptText: string }) => {
      const store = readStore();
      if (!store.categories.some((category) => category.id === payload.categoryId)) throw new Error("Category not found.");
      const timestamp = now();
      const prompt: Prompt = { id: nextId(store.prompts), categoryId: payload.categoryId, thumbnail: payload.thumbnail || null, promptText: ensureText(payload.promptText, "Prompt text is required."), createdAt: timestamp, updatedAt: timestamp };
      store.prompts.unshift(prompt);
      writeStore(withPromptCounts(store));
      return { prompt };
    },
    update: async (id: number | string, payload: Partial<{ thumbnail: string | null; promptText: string }>) => {
      const store = readStore();
      const prompt = store.prompts.find((item) => item.id === Number(id));
      if (!prompt) throw new Error("Prompt not found.");
      if (payload.thumbnail !== undefined) prompt.thumbnail = payload.thumbnail || null;
      if (payload.promptText !== undefined) prompt.promptText = ensureText(payload.promptText, "Prompt text is required.");
      prompt.updatedAt = now();
      writeStore(withPromptCounts(store));
      return { prompt };
    },
    remove: async (id: number | string) => {
      const store = readStore();
      const promptId = Number(id);
      if (!store.prompts.some((item) => item.id === promptId)) throw new Error("Prompt not found.");
      store.prompts = store.prompts.filter((item) => item.id !== promptId);
      writeStore(withPromptCounts(store));
      return { ok: true as const };
    },
  },
};
