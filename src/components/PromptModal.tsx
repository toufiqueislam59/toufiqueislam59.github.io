"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ImageUploader } from "@/components/ImageUploader";
import type { Prompt } from "@/lib/types";

export function PromptModal({
  open,
  onClose,
  onSubmit,
  prompt,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { thumbnail: string | null; promptText: string }) => Promise<void> | void;
  prompt: Prompt | null;
  saving?: boolean;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [promptText, setPromptText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setThumbnail(prompt?.thumbnail ?? null);
      setPromptText(prompt?.promptText ?? "");
      setError(null);
    }
  }, [open, prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      setError("Prompt text cannot be empty.");
      return;
    }
    setError(null);
    await onSubmit({ thumbnail, promptText });
  };

  return (
    <Modal open={open} onClose={onClose} title={prompt ? "Edit Prompt" : "Add Prompt"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <ImageUploader value={thumbnail} onChange={setThumbnail} label="Prompt Thumbnail" />

        <div>
          <label htmlFor="prompt-text" className="mb-1.5 block text-sm font-medium text-black">
            Prompt Text
          </label>
          <textarea
            id="prompt-text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={12}
            placeholder="Paste or write your complete AI prompt here..."
            className="w-full resize-y rounded-lg border border-black/20 bg-white px-3 py-2.5 font-mono text-sm leading-relaxed text-black outline-none transition focus:border-red-600 focus-ring-red"
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
            {saving ? "Saving..." : "Save Prompt"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
