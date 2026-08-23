"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, EditIcon, TrashIcon, ImageIcon } from "@/components/icons";
import { PromptTextBox } from "@/components/PromptTextBox";
import { PromptModal } from "@/components/PromptModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api-client";
import type { Category, Prompt } from "@/lib/types";

export function PromptDetailClient({ promptId }: { promptId: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { prompt } = await api.prompts.get(promptId);
      setPrompt(prompt);
      try {
        const { category } = await api.categories.get(prompt.categoryId);
        setCategory(category);
      } catch {
        setCategory(null);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptId]);

  const handleQuickSave = async (newText: string) => {
    if (!prompt) return;
    const { prompt: updated } = await api.prompts.update(prompt.id, { promptText: newText });
    setPrompt(updated);
    showToast("Prompt updated");
  };

  const handleModalSave = async (payload: { thumbnail: string | null; promptText: string }) => {
    if (!prompt) return;
    setSaving(true);
    try {
      const { prompt: updated } = await api.prompts.update(prompt.id, payload);
      setPrompt(updated);
      showToast("Prompt updated");
      setModalOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save prompt.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!prompt) return;
    setDeleting(true);
    try {
      await api.prompts.remove(prompt.id);
      showToast("Prompt deleted");
      router.push(category ? `/?categoryId=${category.id}` : "/");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete prompt.", "error");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-black/5" />
      </div>
    );
  }

  if (notFound || !prompt) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-lg font-medium text-black">Prompt not found.</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
          Back to Categories
        </Link>
      </div>
    );
  }

  const backHref = category ? `/?categoryId=${category.id}` : "/";

  return (
    <div>
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-5 sm:px-6">
          <Link
            href={backHref}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/25 text-white transition hover:border-red-600 hover:bg-red-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-white sm:text-xl">
            {category?.name ?? "Prompt"}
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium text-white transition hover:border-red-600 hover:bg-red-600"
            >
              <EditIcon className="h-4 w-4" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[380px_1fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-sm">
          {prompt.thumbnail ? (
            <Image src={prompt.thumbnail} alt="Prompt output" fill unoptimized sizes="380px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/20">
              <ImageIcon className="h-16 w-16" />
            </div>
          )}
        </div>

        <div>
          <PromptTextBox text={prompt.promptText} onSave={handleQuickSave} />
        </div>
      </div>

      <PromptModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSave}
        prompt={prompt}
        saving={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt?"
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
