import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Config for high-density, low-cost processing
const TOTAL_CHAR_LIMIT = 32000;
const MAX_CHARS_PER_FILE = 4000; // Ensures one giant file doesn't eat the whole budget
const IGNORED_EXTENSIONS = [".lock", ".json", ".map", ".md", ".svg", ".png"];

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, pullNumber } = await request.json();

    const diffResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.diff",
        },
      },
    );

    if (!diffResponse.ok) throw new Error("Failed to fetch PR diff");
    const diffText = await diffResponse.text();

    const fileDiffs = diffText.split("diff --git ");
    let budgetRemaining = TOTAL_CHAR_LIMIT;

    const processedFiles = fileDiffs
      .map((file) => {
        if (!file.trim()) return "";

        const isIgnored = IGNORED_EXTENSIONS.some((ext) =>
          file.toLowerCase().includes(ext),
        );
        if (isIgnored && fileDiffs.length > 5) return ""; // Only ignore if it's a large PR

        let fileContent = file;
        if (fileContent.length > MAX_CHARS_PER_FILE) {
          fileContent =
            fileContent.substring(0, MAX_CHARS_PER_FILE) +
            "\n... [File Truncated] ...";
        }

        if (budgetRemaining <= 0) return "";
        const chunk = fileContent.substring(0, budgetRemaining);
        budgetRemaining -= chunk.length;

        return "diff --git " + chunk;
      })
      .filter(Boolean)
      .join("\n");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a high-density intelligence engine. Summarize technical changes.
          Output strictly in 3 bullets:
          - Logic: summary of code changes
          - Impact: application behavior changes
          - Risk: potential bugs or debt
          Be extremely concise. Use technical shorthand.`,
        },
        {
          role: "user",
          content: `Diff content:\n${processedFiles}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 300, // Reduced for token spend sensitivity
      top_p: 1,
    });

    return NextResponse.json({
      summary:
        completion.choices[0]?.message?.content || "Analysis unavailable.",
    });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      {
        error:
          error.status === 413
            ? "PR too large for AI gateway"
            : "Intelligence engine failure",
      },
      { status: error.status || 500 },
    );
  }
}
