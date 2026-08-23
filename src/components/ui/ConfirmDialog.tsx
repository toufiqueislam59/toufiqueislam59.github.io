"use client";

import { Modal } from "@/components/ui/Modal";
import { AlertIcon } from "@/components/icons";

export function ConfirmDialog({
  open,
  title,
  message,
  warning,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}: {
  open: boolean;
  title: string;
  message: string;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-md">
      <p className="text-sm leading-relaxed text-black/80">{message}</p>
      {warning ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{warning}</span>
        </div>
      ) : null}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-black/80"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
