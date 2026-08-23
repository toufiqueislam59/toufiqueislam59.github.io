"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryPageClient } from "@/components/CategoryPageClient";
import { PromptDetailClient } from "@/components/PromptDetailClient";
import { CategoryCard } from "@/components/CategoryCard";
import { CategoryModal } from "@/components/CategoryModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/api-client";
import { PlusIcon, ImageIcon } from "@/components/icons";
import type { Category } from "@/lib/types";

function HomePageContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const promptId = searchParams.get("promptId");
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const { categories } = await api.categories.list();
      setCategories(categories);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (payload: { name: string; thumbnail: string | null }) => {
    setSaving(true);
    try {
      if (editingCategory) {
        const { category } = await api.categories.update(editingCategory.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
        showToast("Category updated");
      } else {
        const { category } = await api.categories.create(payload);
        setCategories((prev) => [category, ...prev]);
        showToast("Category added");
      }
      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save category.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.categories.remove(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("Category deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete category.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (promptId) return <PromptDetailClient promptId={promptId} />;
  if (categoryId) return <CategoryPageClient categoryId={categoryId} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div id="categories" className="scroll-mt-24" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">CATEGORIES</h1>
          <p className="mt-1.5 text-sm text-black/60">
            Organize your AI prompts by category, then open one to browse, edit and copy prompts instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <PlusIcon className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-black/5" />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {loadError}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/15 py-20 text-center">
            <ImageIcon className="h-10 w-10 text-black/20" />
            <p className="text-base font-medium text-black/60">No categories yet</p>
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <PlusIcon className="h-4 w-4" /> Add Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={() => {
                  setEditingCategory(category);
                  setModalOpen(true);
                }}
                onDelete={() => setDeleteTarget(category)}
              />
            ))}
          </div>
        )}
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSave}
        category={editingCategory}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        warning={
          deleteTarget && deleteTarget.promptCount > 0
            ? `This category contains ${deleteTarget.promptCount} ${
                deleteTarget.promptCount === 1 ? "prompt" : "prompts"
              }. Deleting it will permanently delete all of its prompts too.`
            : undefined
        }
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14"><div className="h-40 animate-pulse rounded-2xl bg-black/5" /></div>}>
      <HomePageContent />
    </Suspense>
  );
}
