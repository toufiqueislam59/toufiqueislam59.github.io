"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { useToast } from "@/components/ui/ToastProvider";

export function PromptTextBox({
  text,
  onSave,
}: {
  text: string;
  onSave: (newText: string) => Promise<void> | void;
}) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) setDraft(text);
  }, [text, editing]);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setDraft(text);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(text);
    setEditing(false);
  };

  const saveEdit = async () => {
    if (!draft.trim()) {
      showToast("Prompt text cannot be empty.", "error");
      return;
    }
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save prompt.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-black/40">
          {editing ? "Editing — double-click not needed while editing" : "Double-click text to quick-edit"}
        </span>
        <CopyButton text={text} />
      </div>

      {editing ? (
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-lg border border-red-300 bg-white px-3 py-2.5 font-mono text-sm leading-relaxed text-black outline-none transition focus:border-red-600 focus-ring-red"
          />
          <div className="mt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <pre
          onDoubleClick={startEdit}
          title="Double-click to edit"
          className="max-h-[60vh] cursor-text overflow-y-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-relaxed text-black selection:bg-red-200"
        >
          {text}
        </pre>
      )}
    </div>
  );
}
