import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | TI GRAPHICS",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="TI GRAPHICS logo"
          width={88}
          height={88}
          className="h-20 w-20 rounded-2xl object-cover shadow-md sm:h-24 sm:w-24"
        />
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-black sm:text-4xl">TI GRAPHICS</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-red-600">
          Designer &amp; AI Prompt Engineer
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-black/10 shadow-sm">
        <div className="relative aspect-[16/9] w-full bg-black/5">
          <Image
            src="/images/about-profile.jpg"
            alt="TI GRAPHICS workspace"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>

      <div className="mt-10 space-y-6 text-black/80">
        <section>
          <h2 className="text-lg font-semibold text-black">Introduction</h2>
          <p className="mt-2 leading-relaxed">
            Hi, I&apos;m the person behind <span className="font-semibold text-black">TI GRAPHICS</span>. This is a
            placeholder introduction — replace this paragraph with your real bio, background, and story whenever
            you&apos;re ready. Update the content directly in{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-sm">src/app/about/page.tsx</code>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-black">What I Do</h2>
          <p className="mt-2 leading-relaxed">
            TI GRAPHICS focuses on jersey mockups, logo mockups, and personal photo edits, powered by carefully
            crafted AI prompts. This library exists to keep every one of those prompts organized, reusable, and
            instantly accessible whenever a new project starts. This is placeholder work information — swap it out
            for your actual services, tools, and workflow.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-black">Get in Touch</h2>
          <p className="mt-2 leading-relaxed">
            Find TI GRAPHICS on the social platforms linked in the footer below. Update the profile URLs in{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-sm">src/lib/social.ts</code> once they&apos;re
            ready.
          </p>
        </section>
      </div>
    </div>
  );
}
