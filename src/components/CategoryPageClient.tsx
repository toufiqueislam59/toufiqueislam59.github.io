"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, PlusIcon, ImageIcon } from "@/components/icons";
import { SearchBar } from "@/components/SearchBar";
import { PromptCard } from "@/components/PromptCard";
import { PromptModal } from "@/components/PromptModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api-client";
import type { Category, Prompt } from "@/lib/types";

export function CategoryPageClient({ categoryId }: { categoryId: string }) {
  const { showToast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Prompt | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const [{ category }, { prompts }] = await Promise.all([
        api.categories.get(categoryId),
        api.prompts.list({ categoryId }),
      ]);
      setCategory(category);
      setPrompts(prompts);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const filteredPrompts = useMemo(() => {
    if (!search.trim()) return prompts;
    const q = search.trim().toLowerCase();
    return prompts.filter((p) => p.promptText.toLowerCase().includes(q));
  }, [prompts, search]);

  const handleSave = async (payload: { thumbnail: string | null; promptText: string }) => {
    setSaving(true);
    try {
      if (editingPrompt) {
        const { prompt } = await api.prompts.update(editingPrompt.id, payload);
        setPrompts((prev) => prev.map((p) => (p.id === prompt.id ? prompt : p)));
        showToast("Prompt updated");
      } else {
        const { prompt } = await api.prompts.create({ categoryId: Number(categoryId), ...payload });
        setPrompts((prev) => [prompt, ...prev]);
        showToast("Prompt added");
      }
      setModalOpen(false);
      setEditingPrompt(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save prompt.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.prompts.remove(deleteTarget.id);
      setPrompts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("Prompt deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete prompt.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-lg font-medium text-black">Category not found.</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-5 sm:px-6">
          <Link
            href="/"
            aria-label="Back to categories"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/25 text-white transition hover:border-red-600 hover:bg-red-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-white sm:text-2xl">
            {loading ? "Loading..." : category?.name}
          </h1>
          <button
            type="button"
            onClick={() => {
              setEditingPrompt(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <PlusIcon className="h-4 w-4" /> Add Prompt
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SearchBar value={search} onChange={setSearch} />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-black/5" />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/15 py-20 text-center">
              <ImageIcon className="h-10 w-10 text-black/20" />
              <p className="text-base font-medium text-black/60">No prompts yet</p>
              <button
                type="button"
                onClick={() => {
                  setEditingPrompt(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <PlusIcon className="h-4 w-4" /> Add Prompt
              </button>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 py-16 text-center text-sm text-black/50">
              No prompts found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={() => {
                    setEditingPrompt(prompt);
                    setModalOpen(true);
                  }}
                  onDelete={() => setDeleteTarget(prompt)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <PromptModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPrompt(null);
        }}
        onSubmit={handleSave}
        prompt={editingPrompt}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt?"
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
