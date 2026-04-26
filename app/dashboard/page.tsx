"use client";

import React, { useState } from "react";
import {
  Terminal,
  GitPullRequest,
  CircleDot,
  Settings,
  Search,
  ChevronDown,
  ExternalLink,
  MessageSquareText,
  User,
} from "lucide-react";

// Mock data for UI demonstration
const MOCK_PRS = [
  {
    id: 1245,
    title: "feat: implement groq cloud summarization",
    author: "shadcn",
    date: "2 hours ago",
    branch: "feature/ai-summary",
  },
  {
    id: 1244,
    title: "fix: resolve hydration mismatch in sidebar",
    author: "leerob",
    date: "5 hours ago",
    branch: "fix/hydration",
  },
  {
    id: 1243,
    title: "refactor: optimize git diff parser performance",
    author: "m_uiss",
    date: "1 day ago",
    branch: "perf/diff-parser",
  },
];

const Dashboard = () => {
  const [viewState, setViewState] = useState<"open" | "closed">("open");

  return (
    <div className="flex h-screen w-full bg-[#0B141C] text-[#DAE3EE] font-['Inter']">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-[#414753] bg-[#0B141C] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-[#222B33] border border-[#414753] flex items-center justify-center rounded">
            <Terminal size={18} className="text-[#AAC7FF]" />
          </div>
          <span className="font-semibold tracking-tight text-lg">GitDash</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            icon={<GitPullRequest size={18} />}
            label="Pull Requests"
            active
          />
          <NavItem icon={<CircleDot size={18} />} label="Issues" disabled />
          <NavItem icon={<Settings size={18} />} label="Settings" disabled />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header / Breadcrumbs */}
        <header className="h-16 border-b border-[#414753] flex items-center justify-between px-8 bg-[#0B141C]/50 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#8B919F]">facebook</span>
            <span className="text-[#414753]">/</span>
            <span className="font-medium">react</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-[#222B33] border border-[#414753] rounded overflow-hidden">
              <button
                onClick={() => setViewState("open")}
                className={`px-4 py-1.5 text-xs font-medium transition-colors ${viewState === "open" ? "bg-[#AAC7FF] text-[#002F65]" : "text-[#8B919F] hover:text-[#DAE3EE]"}`}
              >
                Open
              </button>
              <button
                onClick={() => setViewState("closed")}
                className={`px-4 py-1.5 text-xs font-medium transition-colors ${viewState === "closed" ? "bg-[#AAC7FF] text-[#002F65]" : "text-[#8B919F] hover:text-[#DAE3EE]"}`}
              >
                Closed
              </button>
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <section className="p-8 pb-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              {viewState === "open" ? "Open" : "Closed"} Pull Requests
              <span className="ml-3 text-sm font-normal text-[#8B919F] bg-[#222B33] px-2 py-0.5 rounded border border-[#414753]">
                124
              </span>
            </h2>
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B919F]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search pull requests..."
                className="w-full bg-[#0B141C] border border-[#414753] rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#AAC7FF]/50 shadow-inner"
              />
            </div>

            {/* Non-functional dropdowns per requirement */}
            <DropdownLabel text="Labels" />
            <DropdownLabel text="Assignee" />
          </div>
        </section>

        {/* PR List Area */}
        <section className="flex-1 overflow-y-auto px-8 pb-8 space-y-3">
          {MOCK_PRS.map((pr) => (
            <div
              key={pr.id}
              className="group relative bg-[#161F28]/40 border border-[#414753] hover:border-[#AAC7FF]/40 transition-all p-5 rounded-lg flex items-start justify-between"
            >
              <div className="flex gap-4">
                <div className="mt-1 text-[#AAC7FF]">
                  <GitPullRequest size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[15px] group-hover:text-[#AAC7FF] transition-colors flex items-center gap-2">
                    {pr.title}
                    <ExternalLink
                      size={14}
                      className="text-[#414753] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#8B919F]">
                    <span>#{pr.id}</span>
                    <span className="w-1 h-1 rounded-full bg-[#414753]" />
                    <span>
                      opened {pr.date} by <b>{pr.author}</b>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#414753]" />
                    <code className="bg-[#222B33] px-1.5 py-0.5 rounded text-[#AAC7FF]">
                      {pr.branch}
                    </code>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 bg-[#AAC7FF] hover:bg-[#c2d6ff] text-[#002F65] px-4 py-2 rounded text-xs font-bold transition-all shadow-lg active:scale-95">
                <MessageSquareText size={14} />
                Summarize
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

/* --- Sub-components for Cleanliness --- */

const NavItem = ({
  icon,
  label,
  active = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) => (
  <div
    className={`
    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors
    ${active ? "bg-[#AAC7FF]/10 text-[#AAC7FF] border border-[#AAC7FF]/20" : "text-[#8B919F] hover:bg-[#222B33] hover:text-[#DAE3EE]"}
    ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}
  `}
  >
    {icon}
    {label}
  </div>
);

const DropdownLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-[#0B141C] border border-[#414753] rounded-md text-sm text-[#8B919F] cursor-not-allowed opacity-80">
    {text}
    <ChevronDown size={14} />
  </div>
);

export default Dashboard;
