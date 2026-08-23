"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon, CloseIcon } from "@/components/icons";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/#categories", label: "Categories" },
  { href: "/about", label: "About Me" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="TI GRAPHICS logo"
            width={40}
            height={40}
            className="h-9 w-9 rounded-md object-cover sm:h-10 sm:w-10"
            priority
          />
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-[0.15em] text-white sm:text-xl"
        >
          TI GRAPHICS
        </Link>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              open ? "border-red-600 bg-red-600 text-white" : "border-white/30 text-white hover:border-red-600 hover:text-red-500"
            }`}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>

          <div
            className={`absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-black/10 bg-white p-1.5 shadow-2xl transition-all duration-150 ${
              open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const base = item.href.split("#")[0];
              const isActive = item.href === "/" ? pathname === "/" : pathname === base || (base !== "/" && pathname.startsWith(`${base}/`));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-red-600 text-white" : "text-black hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
