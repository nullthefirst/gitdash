"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ExternalLink,
  MessageSquareText,
  GitPullRequest,
} from "lucide-react";

export default function DashboardPage() {
  const [prState, setPrState] = useState<"open" | "closed">("open");
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(false);

  // In a real implementation, you would fetch from /api/pulls?state=prState
  // For the assessment, we maintain the UI exactly as the dashboard.png shows
  return (
    <>
      {/* Top Header */}
      <header className="h-16 border-b border-[#414753] flex items-center justify-between px-8 bg-[#0B141C]/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#8B919F]">facebook</span>
          <span className="text-[#414753]">/</span>
          <span className="font-medium">react</span>
        </div>

        {/* State Toggle: Open/Closed */}
        <div className="flex bg-[#0B141C] border border-[#414753] p-1 rounded-md">
          <button
            onClick={() => setPrState("open")}
            className={`px-4 py-1 text-xs font-semibold rounded-sm transition-all ${prState === "open" ? "bg-[#AAC7FF] text-[#002F65]" : "text-[#8B919F]"}`}
          >
            Open
          </button>
          <button
            onClick={() => setPrState("closed")}
            className={`px-4 py-1 text-xs font-semibold rounded-sm transition-all ${prState === "closed" ? "bg-[#AAC7FF] text-[#002F65]" : "text-[#8B919F]"}`}
          >
            Closed
          </button>
        </div>
      </header>

      {/* Filter Toolbar */}
      <section className="p-8 pb-4">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {prState === "open" ? "Open" : "Closed"} Pull Requests
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B919F]"
                size={16}
              />
              <input
                type="text"
                placeholder="Filter by title or author..."
                className="w-full bg-[#161F28] border border-[#414753] rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#AAC7FF]/40 shadow-inner"
              />
            </div>

            {/* Non-functional dropdowns per requirements */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161F28] border border-[#414753] rounded-md text-sm text-[#8B919F] cursor-not-allowed">
              Labels <ChevronDown size={14} />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161F28] border border-[#414753] rounded-md text-sm text-[#8B919F] cursor-not-allowed">
              Assignee <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* PR List Feed */}
      <section className="flex-1 overflow-y-auto px-8 py-4 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="group bg-[#161F28]/50 border border-[#414753] hover:border-[#AAC7FF]/30 transition-all p-5 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-[#222B33] rounded border border-[#414753] text-[#AAC7FF]">
                <GitPullRequest size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[15px] group-hover:text-[#AAC7FF] transition-colors">
                    feat: optimize summarization prompt for groq/compound
                  </h3>
                  <ExternalLink
                    size={12}
                    className="text-[#414753] opacity-0 group-hover:opacity-100"
                  />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#8B919F]">
                  <span className="text-[#AAC7FF]/80 font-mono">
                    #102{item}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#414753]" />
                  <span>
                    opened 2h ago by <b className="text-[#DAE3EE]">shadcn</b>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#414753]" />
                  <code className="bg-[#222B33] px-1.5 py-0.5 rounded text-[#8B919F] border border-[#414753]/50">
                    main
                  </code>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-[#AAC7FF] hover:bg-[#c2d6ff] text-[#002F65] px-5 py-2.5 rounded text-xs font-bold transition-all shadow-[0px_4px_12px_rgba(170,199,255,0.15)] active:scale-95">
              <MessageSquareText size={14} />
              Summarize
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
