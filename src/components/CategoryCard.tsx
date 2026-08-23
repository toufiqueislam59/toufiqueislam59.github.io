"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KebabIcon, EditIcon, TrashIcon, ImageIcon } from "@/components/icons";
import type { Category } from "@/lib/types";

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-600 hover:shadow-lg">
      <Link href={`/?categoryId=${category.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-black/5">
          {category.thumbnail ? (
            <Image
              src={category.thumbnail}
              alt={category.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/20">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="p-4 pr-10">
          <h3 className="truncate text-base font-semibold text-black">{category.name}</h3>
          <p className="mt-1 text-xs font-medium text-black/50">
            {category.promptCount} {category.promptCount === 1 ? "prompt" : "prompts"}
          </p>
        </div>
      </Link>

      <div className="absolute right-2 top-2" ref={menuRef}>
        <button
          type="button"
          aria-label="Category options"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-black shadow transition hover:bg-red-600 hover:text-white"
        >
          <KebabIcon className="h-4 w-4" />
        </button>
        {menuOpen ? (
          <div className="absolute right-0 mt-1 w-36 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-black hover:bg-black/5"
            >
              <EditIcon className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <TrashIcon className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
