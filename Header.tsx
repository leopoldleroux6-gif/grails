"use client";
import { Sparkles, Github } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-lime flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-bg" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display font-bold text-xl tracking-tight">GRAILS</div>
          <div className="text-[11px] text-muted -mt-1 tracking-wide uppercase">Sneaker & Streetwear OS</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="chip text-muted bg-white/5 border border-white/5">
          <span className="h-2 w-2 rounded-full bg-lime dot-live" />
          IA en direct
        </span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost !py-2 !px-3 text-xs"
        >
          <Github className="h-4 w-4" /> GitHub
        </a>
      </div>
    </header>
  );
}
