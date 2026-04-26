"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Link as LinkIcon,
  ArrowRight,
  Lock,
  Zap,
} from "lucide-react";

const StartPage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    // Encode the URL and pass it as a query parameter
    const encodedUrl = encodeURIComponent(repoUrl);
    router.push(`/dashboard?repoUrl=${encodedUrl}`);
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B141C] font-['Inter']">
      <div
        className="pointer-events-none absolute h-[1024px] w-[1440px] opacity-30"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(170, 199, 255, 0.1) 0%, rgba(11, 20, 28, 0) 100%)",
          filter: "blur(140px)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center px-6 text-center">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center border border-[#414753] bg-[#222B33] shadow-[0px_0px_30px_rgba(170,199,255,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#AAC7FF]/10 to-transparent" />
          <Terminal className="relative z-10 h-7 w-7 text-[#AAC7FF]" />
        </div>

        <h1 className="mb-4 text-[20px] font-semibold tracking-tight text-[#DAE3EE] lg:text-2xl">
          Initialize Repository Analysis
        </h1>

        <form
          onSubmit={handleAnalyze}
          className="relative flex w-full max-w-[592px] items-center"
        >
          <div className="absolute left-4 z-10 flex items-center justify-center text-[#8B919F]">
            <LinkIcon size={18} />
          </div>

          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/facebook/react"
            className="h-14 w-full border border-[#414753] bg-[#0B141C] pl-12 pr-36 text-sm text-[#DAE3EE] placeholder-[#8B919F] shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.2)] outline-none focus:border-[#AAC7FF]/50 transition-colors"
          />

          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-11 items-center gap-2 bg-[#AAC7FF] px-5 text-sm font-semibold text-[#002F65] transition-opacity hover:opacity-90 active:scale-95"
          >
            Analyze
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-4 w-full max-w-[400px]">
          <p className="text-center text-[12px] leading-[17px] text-[#C1C6D6]">
            Enter a public GitHub repository URL to generate a high-density,
            terminal-precision intelligence dashboard.
          </p>
        </div>
      </div>
    </main>
  );
};

export default StartPage;
