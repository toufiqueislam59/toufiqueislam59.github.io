"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ImageUploader } from "@/components/ImageUploader";
import type { Category } from "@/lib/types";

export function CategoryModal({
  open,
  onClose,
  onSubmit,
  category,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; thumbnail: string | null }) => Promise<void> | void;
  category: Category | null;
  saving?: boolean;
}) {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setThumbnail(category?.thumbnail ?? null);
      setError(null);
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);
    await onSubmit({ name: name.trim(), thumbnail });
  };

  return (
    <Modal open={open} onClose={onClose} title={category ? "Edit Category" : "Add Category"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <ImageUploader value={thumbnail} onChange={setThumbnail} label="Category Thumbnail" />

        <div>
          <label htmlFor="category-name" className="mb-1.5 block text-sm font-medium text-black">
            Category Name
          </label>
          <input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jersey Mockup"
            className="w-full rounded-lg border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-red-600 focus-ring-red"
          />
          {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
