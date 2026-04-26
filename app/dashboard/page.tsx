"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  ExternalLink,
  MessageSquareText,
  GitPullRequest,
} from "lucide-react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repoUrl");

  const [prState, setPrState] = useState<"open" | "closed">("open");
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPulls() {
      if (!repoUrl) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/pulls?repoUrl=${encodeURIComponent(repoUrl)}&state=${prState}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setPulls(data);
        }
      } catch (err) {
        console.error("Failed to fetch PRs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPulls();
  }, [repoUrl, prState]);

  // Extract owner/repo name for the header breadcrumbs
  const repoName = repoUrl?.replace("https://github.com/", "") || "repository";
  const [owner, name] = repoName.split("/");

  return (
    <>
      <header className="h-16 border-b border-[#414753] flex items-center justify-between px-8 bg-[#0B141C]/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#8B919F]">{owner}</span>
          <span className="text-[#414753]">/</span>
          <span className="font-medium">{name}</span>
        </div>

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

      <section className="p-8 pb-4">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {prState === "open" ? "Open" : "Closed"} Pull Requests
          </h1>
          {/* Filter bars remain here... */}
        </div>
      </section>

      <section className="flex-1 overflow-y-auto px-8 py-4 space-y-3">
        {loading ? (
          <div className="text-[#8B919F] animate-pulse">
            Loading intelligence feed...
          </div>
        ) : (
          pulls.map((pr: any) => (
            <div
              key={pr.id}
              className="group bg-[#161F28]/50 border border-[#414753] hover:border-[#AAC7FF]/30 transition-all p-5 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-[#222B33] rounded border border-[#414753] text-[#AAC7FF]">
                  <GitPullRequest size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[15px] group-hover:text-[#AAC7FF] transition-colors">
                      {pr.title}
                    </h3>
                    <a href={pr.html_url} target="_blank" rel="noreferrer">
                      <ExternalLink
                        size={12}
                        className="text-[#414753] opacity-0 group-hover:opacity-100"
                      />
                    </a>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[#8B919F]">
                    <span className="text-[#AAC7FF]/80 font-mono">
                      #{pr.number}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#414753]" />
                    <span>
                      opened by{" "}
                      <b className="text-[#DAE3EE]">{pr.user.login}</b>
                    </span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 bg-[#AAC7FF] hover:bg-[#c2d6ff] text-[#002F65] px-5 py-2.5 rounded text-xs font-bold shadow-[0px_4px_12px_rgba(170,199,255,0.15)] active:scale-95 transition-all">
                <MessageSquareText size={14} />
                Summarize
              </button>
            </div>
          ))
        )}
      </section>
    </>
  );
}
