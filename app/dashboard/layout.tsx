import React from "react";
import { Terminal, GitPullRequest, CircleDot, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#0B141C] text-[#DAE3EE] font-['Inter']">
      {/* Sidebar - Fixed width 256px as per Figma CSS */}
      <aside className="w-64 border-r border-[#414753] bg-[#0B141C] flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-[#222B33] border border-[#414753] flex items-center justify-center rounded shadow-[0px_0px_20px_rgba(170,199,255,0.05)]">
            <Terminal size={16} className="text-[#AAC7FF]" />
          </div>
          <span className="font-bold tracking-tight text-[16px]">GitDash</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          {/* Pull Requests is active by default */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium bg-[#AAC7FF]/10 text-[#AAC7FF] border border-[#AAC7FF]/20 cursor-pointer">
            <GitPullRequest size={18} />
            Pull Requests
          </div>

          {/* UI Fillers - Non-functional per requirements */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-[#8B919F] opacity-40 cursor-not-allowed">
            <CircleDot size={18} />
            Issues
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-[#8B919F] opacity-40 cursor-not-allowed">
            <Settings size={18} />
            Settings
          </div>
        </nav>

        <div className="p-6 border-t border-[#414753]">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#8B919F]">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            AI Engine: Online
          </div>
        </div>
      </aside>

      {/* Dynamic Page Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
