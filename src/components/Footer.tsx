import Image from "next/image";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social";
import { FacebookIcon, BehanceIcon, LinkedInIcon, InstagramIcon } from "@/components/icons";

export function Footer() {
  const socials = [
    { href: SOCIAL_LINKS.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: SOCIAL_LINKS.behance, label: "Behance", Icon: BehanceIcon },
    { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.svg" alt="TI GRAPHICS logo" width={36} height={36} className="h-9 w-9 rounded-md object-cover" />
          <span className="text-base font-bold tracking-[0.12em]">TI GRAPHICS</span>
        </Link>

        <div className="flex items-center gap-3">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-red-600 hover:bg-red-600"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} TI GRAPHICS. All prompts and mockups organized in one place.
      </div>
    </footer>
  );
}
