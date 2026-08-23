"use client";

import Image from "next/image";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { EditIcon, TrashIcon, ImageIcon } from "@/components/icons";
import type { Prompt } from "@/lib/types";

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
}: {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-600 hover:shadow-lg">
      <Link href={`/?promptId=${prompt.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-black/5">
          {prompt.thumbnail ? (
            <Image
              src={prompt.thumbnail}
              alt="Prompt output preview"
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/20">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
        </div>
      </Link>

      <div className="absolute right-2 top-2">
        <CopyButton
          text={prompt.promptText}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-black shadow transition hover:bg-red-600 hover:text-white"
        />
      </div>

      <Link href={`/?promptId=${prompt.id}`} className="block flex-1 px-4 pb-3 pt-3">
        <p className="line-clamp-6 whitespace-pre-line text-sm leading-relaxed text-black/80">{prompt.promptText}</p>
      </Link>

      <div className="flex items-center justify-end gap-2 border-t border-black/5 px-3 py-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black transition hover:bg-black/5"
        >
          <EditIcon className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
        >
          <TrashIcon className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
