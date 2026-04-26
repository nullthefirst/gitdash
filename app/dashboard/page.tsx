"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Search,
  ChevronDown,
  ExternalLink,
  MessageSquareText,
  GitPullRequest,
  Loader2,
  Sparkles,
  ChevronUp,
  Filter,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repoUrl") || "facebook/react";

  const [prState, setPrState] = useState<"open" | "closed">("open");
  const [pulls, setPulls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for AI responses
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({});
  const [errors, setErrors] = useState<{ [key: number]: string }>({}); // New Error State
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPulls() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/pulls?repoUrl=${encodeURIComponent(repoUrl)}&state=${prState}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) setPulls(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPulls();
  }, [repoUrl, prState]);

  const handleSummarize = async (
    prNumber: number,
    owner: string,
    repo: string,
  ) => {
    // Toggle if content (summary or error) already exists
    if (summaries[prNumber] || errors[prNumber]) {
      setExpandedId(expandedId === prNumber ? null : prNumber);
      return;
    }

    setGeneratingId(prNumber);
    setErrors((prev) => ({ ...prev, [prNumber]: "" })); // Clear previous errors

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, pullNumber: prNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Error ${response.status}: Failed to generate summary`,
        );
      }

      if (data.summary) {
        setSummaries((prev) => ({ ...prev, [prNumber]: data.summary }));
        setExpandedId(prNumber);
      }
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [prNumber]: err.message }));
      setExpandedId(prNumber); // Open panel to show error
    } finally {
      setGeneratingId(null);
    }
  };

  const [owner, name] = repoUrl.replace("https://github.com/", "").split("/");

  return (
    <div className="flex flex-col h-full bg-[#0B141C] text-[#DAE3EE]">
      {/* Header & Toolbar remain the same... */}
      <header className="h-16 border-b border-[#414753] flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="text-[#8B919F]">{owner}</span>
          <span className="text-[#414753]">/</span>
          <span className="font-bold">{name}</span>
        </div>
        <div className="flex bg-[#0B141C] border border-[#414753] p-1 rounded">
          {["open", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setPrState(s as any)}
              className={`px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                prState === s ? "bg-[#AAC7FF] text-[#002F65]" : "text-[#8B919F]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-8 py-10 space-y-4">
        <h1 className="text-[24px] font-bold tracking-tight mb-6 capitalize">
          {prState} Pull Requests
        </h1>

        {loading ? (
          <div className="flex items-center gap-2 text-[#8B919F] font-mono text-xs animate-pulse">
            <Loader2 size={14} className="animate-spin" /> EXECUTING DATA
            FETCH...
          </div>
        ) : (
          pulls.map((pr: any) => (
            <div
              key={pr.id}
              className={`flex flex-col bg-[#161F28] border transition-all rounded-lg overflow-hidden ${
                expandedId === pr.number
                  ? errors[pr.number]
                    ? "border-red-500/50"
                    : "border-[#AAC7FF] shadow-[0_0_15px_rgba(170,199,255,0.1)]"
                  : "border-[#414753]"
              }`}
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 bg-[#222B33] border border-[#414753] flex items-center justify-center rounded text-[#AAC7FF]">
                    <GitPullRequest size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] mb-1 leading-tight">
                      {pr.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[12px] text-[#8B919F]">
                      <span className="text-[#AAC7FF] font-mono font-bold">
                        #{pr.number}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#414753]" />
                      <span>
                        by <b className="text-[#DAE3EE]">{pr.user.login}</b>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSummarize(pr.number, owner, name)}
                  disabled={generatingId === pr.number}
                  className={`flex items-center gap-2 px-5 py-2 rounded text-[12px] font-bold transition-all shrink-0 ${
                    errors[pr.number]
                      ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                      : "bg-[#AAC7FF] hover:bg-[#BBD2FF] text-[#002F65]"
                  }`}
                >
                  {generatingId === pr.number ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : errors[pr.number] ? (
                    <RefreshCcw size={14} />
                  ) : (
                    <MessageSquareText size={14} />
                  )}
                  {generatingId === pr.number
                    ? "Analyzing..."
                    : errors[pr.number]
                      ? "Retry"
                      : "Summarize"}
                </button>
              </div>

              {/* Intelligence / Error Panel */}
              {expandedId === pr.number &&
                (summaries[pr.number] || errors[pr.number]) && (
                  <div
                    className={`border-t p-6 animate-in slide-in-from-top-2 duration-200 ${
                      errors[pr.number]
                        ? "bg-red-950/20 border-red-900/50"
                        : "bg-[#0B141C] border-[#414753]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {errors[pr.number] ? (
                        <>
                          <AlertCircle size={14} className="text-red-400" />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-red-400">
                            Analysis Failed
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="text-[#AAC7FF]" />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#AAC7FF]">
                            Intelligence Summary
                          </span>
                        </>
                      )}
                    </div>

                    <div
                      className={`text-[13px] leading-relaxed ${errors[pr.number] ? "text-red-200/80 font-mono" : "text-[#C1C6D6]"}`}
                    >
                      {errors[pr.number] ? (
                        <div className="p-4 bg-red-950/40 border border-red-900/50 rounded">
                          {errors[pr.number]}
                          <p className="mt-2 text-[11px] opacity-60">
                            Tip: This usually happens if the PR diff is too
                            large for the model's context window.
                          </p>
                        </div>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="space-y-2 mb-3">{children}</ul>
                            ),
                            li: ({ children }) => (
                              <li className="flex gap-3">
                                <span className="text-[#AAC7FF] font-bold">
                                  •
                                </span>
                                <span>{children}</span>
                              </li>
                            ),
                            code: ({ children }) => (
                              <code className="bg-[#222B33] px-1.5 py-0.5 rounded text-[#AAC7FF] border border-[#414753]/50 font-mono text-[12px]">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {summaries[pr.number]}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
