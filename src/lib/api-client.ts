import type { Category, Prompt } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const IMAGE_BUCKET = "prompt-images";

type DbCategory = {
  id: number;
  name: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
};

type DbPrompt = {
  id: number;
  category_id: number;
  thumbnail: string | null;
  prompt_text: string;
  created_at: string;
  updated_at: string;
};

function ensureText(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(message);
  return value.trim();
}

function mapCategory(row: DbCategory, promptCount = 0): Category {
  return {
    id: Number(row.id),
    name: row.name,
    thumbnail: row.thumbnail,
    promptCount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPrompt(row: DbPrompt): Prompt {
  return {
    id: Number(row.id),
    categoryId: Number(row.category_id),
    thumbnail: row.thumbnail,
    promptText: row.prompt_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function resolveThumbnail(value: string | null, folder: "categories" | "prompts") {
  if (!value || !value.startsWith("data:")) return value || null;
  const response = await fetch(value);
  const blob = await response.blob();
  const extension = (blob.type.split("/")[1] || "png").replace("jpeg", "jpg").replace(/[^a-z0-9]/gi, "");
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
    contentType: blob.type || "image/png",
    upsert: false,
  });
  throwIfError(error);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function getPromptCounts() {
  const { data, error } = await supabase.from("prompts").select("category_id");
  throwIfError(error);
  const counts = new Map<number, number>();
  for (const row of (data ?? []) as Array<{ category_id: number }>) {
    const id = Number(row.category_id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

async function getCategoryRow(id: number | string) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", Number(id)).maybeSingle();
  throwIfError(error);
  if (!data) throw new Error("Category not found.");
  return data as DbCategory;
}

async function getPromptRow(id: number | string) {
  const { data, error } = await supabase.from("prompts").select("*").eq("id", Number(id)).maybeSingle();
  throwIfError(error);
  if (!data) throw new Error("Prompt not found.");
  return data as DbPrompt;
}

export const api = {
  categories: {
    list: async () => {
      const [{ data, error }, counts] = await Promise.all([
        supabase.from("categories").select("*").order("created_at", { ascending: false }),
        getPromptCounts(),
      ]);
      throwIfError(error);
      return {
        categories: ((data ?? []) as DbCategory[]).map((row) => mapCategory(row, counts.get(Number(row.id)) ?? 0)),
      };
    },
    get: async (id: number | string) => {
      const [row, counts] = await Promise.all([getCategoryRow(id), getPromptCounts()]);
      return { category: mapCategory(row, counts.get(Number(row.id)) ?? 0) };
    },
    create: async (payload: { name: string; thumbnail: string | null }) => {
      const name = ensureText(payload.name, "Category name is required.");
      const thumbnail = await resolveThumbnail(payload.thumbnail, "categories");
      const { data, error } = await supabase.from("categories").insert({ name, thumbnail }).select("*").single();
      throwIfError(error);
      return { category: mapCategory(data as DbCategory) };
    },
    update: async (id: number | string, payload: Partial<{ name: string; thumbnail: string | null }>) => {
      const values: { name?: string; thumbnail?: string | null; updated_at: string } = { updated_at: new Date().toISOString() };
      if (payload.name !== undefined) values.name = ensureText(payload.name, "Category name is required.");
      if (payload.thumbnail !== undefined) values.thumbnail = await resolveThumbnail(payload.thumbnail, "categories");
      const { data, error } = await supabase.from("categories").update(values).eq("id", Number(id)).select("*").maybeSingle();
      throwIfError(error);
      if (!data) throw new Error("Category not found.");
      const counts = await getPromptCounts();
      return { category: mapCategory(data as DbCategory, counts.get(Number(id)) ?? 0) };
    },
    remove: async (id: number | string) => {
      const { error } = await supabase.from("categories").delete().eq("id", Number(id));
      throwIfError(error);
      return { ok: true as const };
    },
  },
  prompts: {
    list: async (params: { categoryId?: number | string; search?: string }) => {
      let query = supabase.from("prompts").select("*").order("created_at", { ascending: false });
      if (params.categoryId !== undefined) query = query.eq("category_id", Number(params.categoryId));
      if (params.search?.trim()) query = query.ilike("prompt_text", `%${params.search.trim()}%`);
      const { data, error } = await query;
      throwIfError(error);
      return { prompts: ((data ?? []) as DbPrompt[]).map(mapPrompt) };
    },
    get: async (id: number | string) => ({ prompt: mapPrompt(await getPromptRow(id)) }),
    create: async (payload: { categoryId: number; thumbnail: string | null; promptText: string }) => {
      const promptText = ensureText(payload.promptText, "Prompt text is required.");
      const category = await supabase.from("categories").select("id").eq("id", payload.categoryId).maybeSingle();
      throwIfError(category.error);
      if (!category.data) throw new Error("Category not found.");
      const thumbnail = await resolveThumbnail(payload.thumbnail, "prompts");
      const { data, error } = await supabase.from("prompts").insert({ category_id: payload.categoryId, thumbnail, prompt_text: promptText }).select("*").single();
      throwIfError(error);
      return { prompt: mapPrompt(data as DbPrompt) };
    },
    update: async (id: number | string, payload: Partial<{ thumbnail: string | null; promptText: string }>) => {
      const values: { thumbnail?: string | null; prompt_text?: string; updated_at: string } = { updated_at: new Date().toISOString() };
      if (payload.thumbnail !== undefined) values.thumbnail = await resolveThumbnail(payload.thumbnail, "prompts");
      if (payload.promptText !== undefined) values.prompt_text = ensureText(payload.promptText, "Prompt text is required.");
      const { data, error } = await supabase.from("prompts").update(values).eq("id", Number(id)).select("*").maybeSingle();
      throwIfError(error);
      if (!data) throw new Error("Prompt not found.");
      return { prompt: mapPrompt(data as DbPrompt) };
    },
    remove: async (id: number | string) => {
      const { error } = await supabase.from("prompts").delete().eq("id", Number(id));
      throwIfError(error);
      return { ok: true as const };
    },
  },
};
