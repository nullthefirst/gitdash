import React from "react";
import { Terminal } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0B141C] font-['Inter']">
      {/* Brand Icon with Pulse Effect */}
      <div className="relative mb-8 flex h-16 w-16 items-center justify-center border border-[#414753] bg-[#222B33] shadow-[0px_0px_30px_rgba(170,199,255,0.05)]">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#AAC7FF]/10 to-transparent animate-pulse" />
        <Terminal className="relative z-10 h-7 w-7 text-[#AAC7FF]" />
      </div>

      {/* Loading Text */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <h2 className="text-[14px] font-semibold tracking-[0.24px] text-[#AAC7FF] uppercase">
          Analyzing Repository...
        </h2>
      </div>

      {/* Progress Bar Container */}
      <div className="h-[2px] w-[240px] overflow-hidden bg-[#222B33]">
        {/* Animated Progress Fill */}
        <div
          className="h-full bg-[#AAC7FF] shadow-[0_0_8px_rgba(170,199,255,0.5)] animate-progress-loading"
          style={{ width: "40%" }}
        />
      </div>

      {/* Secondary Helper Text */}
      <p className="mt-6 max-w-[280px] text-center text-[12px] leading-[18px] text-[#8B919F]">
        This may take a few seconds depending on the size of the repository.
      </p>
    </div>
  );
}
