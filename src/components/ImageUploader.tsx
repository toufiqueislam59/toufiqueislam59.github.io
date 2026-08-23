"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, TrashIcon } from "@/components/icons";
import { MAX_IMAGE_BYTES } from "@/lib/validate-image";

export function ImageUploader({
  value,
  onChange,
  label = "Thumbnail",
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      setError(null);
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError("Image is too large. Please use a file under 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.onerror = () => setError("Could not read that image. Please try another file.");
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
          isDragging ? "border-red-600 bg-red-50" : "border-black/20 bg-black/[0.02]"
        }`}
      >
        {value ? (
          <>
            <Image src={value} alt="Thumbnail preview" fill sizes="220px" className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-red-600"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-4 py-6 text-center text-black/50 transition hover:text-red-600"
          >
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs font-medium">Click or drop image (1:1)</span>
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-black transition hover:border-red-600 hover:text-red-600"
        >
          {value ? "Replace image" : "Upload image"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error ? <p className="mt-2 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
