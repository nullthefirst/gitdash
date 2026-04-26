import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Constants for Context Window Management
const MAX_TOTAL_CHARS = 25000; // Safe threshold for Groq's gateway
const IGNORED_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".next",
  "dist",
  ".map",
];

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, pullNumber } = await request.json();

    // 1. Fetch the diff
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
    let diffText = await diffResponse.text();

    // 2. Intelligent Truncation: Filter out noise files manually if they exist in the diff string
    // Note: v3.diff returns a plain string. We split by file headers to filter.
    const diffFiles = diffText.split("diff --git ");

    const filteredDiff = diffFiles
      .filter((file) => {
        // Keep the first segment (usually empty or metadata)
        if (!file.includes("a/")) return true;
        // Drop ignored files to save space
        return !IGNORED_FILES.some((ignored) => file.includes(ignored));
      })
      .join("diff --git ");

    // 3. Hard Character Cap for Gateway Safety
    let processedDiff = filteredDiff;
    if (filteredDiff.length > MAX_TOTAL_CHARS) {
      processedDiff =
        filteredDiff.substring(0, MAX_TOTAL_CHARS) +
        "\n\n... [TRUNCATED: PR too large for full analysis] ...";
    }

    // 4. Groq Inference
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a high-density intelligence engine.
          Analyze the git diff and provide a 3-bullet point summary.
          Strictly follow this format:
          - Logic: [Brief explanation of code changes]
          - Impact: [How this affects the application]
          - Risk: [Potential side effects or technical debt]
          Keep response concise and technical.`,
        },
        {
          role: "user",
          content: `Analyze this git diff:\n\n${processedDiff}`,
        },
      ],
      model: "groq/compound", // or "llama-3.3-70b-versatile" for massive windows
      temperature: 0.1,
      max_tokens: 512, // Limits response size to save output window
    });

    const summary =
      completion.choices[0]?.message?.content || "Analysis unavailable.";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);

    // Explicitly check for Groq specific errors
    const errorMessage =
      error.status === 413
        ? "Payload too large. Try a smaller Pull Request."
        : "Intelligence engine failed";

    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 },
    );
  }
}
