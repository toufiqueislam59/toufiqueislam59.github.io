"use client";

import { copyText } from "@/lib/clipboard";
import { useToast } from "@/components/ui/ToastProvider";
import { CopyIcon } from "@/components/icons";

export function CopyButton({
  text,
  className = "",
  label,
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const { showToast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!text) {
      showToast("Nothing to copy.", "error");
      return;
    }
    const success = await copyText(text);
    if (success) {
      showToast("Copied");
    } else {
      showToast("Could not copy. Try selecting the text manually.", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy prompt"
      title="Copy full prompt"
      className={
        className ||
        "inline-flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:border-red-600 hover:bg-red-600 hover:text-white"
      }
    >
      <CopyIcon className="h-4 w-4" />
      {label ? <span>{label}</span> : null}
    </button>
  );
}
