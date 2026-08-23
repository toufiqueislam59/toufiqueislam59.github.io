"use client";

import { SearchIcon } from "@/components/icons";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search prompts...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-black/20 bg-white py-2.5 pl-9 pr-3 text-sm text-black outline-none transition focus:border-red-600 focus-ring-red"
      />
    </div>
  );
}
