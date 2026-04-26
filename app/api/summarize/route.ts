import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

    // Define a max character limit for the raw text (e.g., 30,000 chars)
    const MAX_DIFF_LENGTH = 5000;

    let processedDiff = diffText;

    if (diffText.length > MAX_DIFF_LENGTH) {
      processedDiff =
        diffText.substring(0, MAX_DIFF_LENGTH) +
        "\n\n... [Diff truncated due to size limits] ...";
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a high-density intelligence engine.
          Analyze the git diff and provide a 3-bullet point summary.
          Strictly follow this format:
          - Logic: [Brief explanation of code changes]
          - Impact: [How this affects the application]
          - Risk: [Potential side effects or technical debt]`,
        },
        {
          role: "user",
          content: `Analyze this diff:\n\n${processedDiff}`,
        },
      ],
      // Using groq/compound for better reasoning, or groq/compound-mini for speed
      model: "groq/compound",
      temperature: 0.2, // Lower temperature for more factual, consistent summaries
    });

    const summary =
      completion.choices[0]?.message?.content || "Analysis unavailable.";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Intelligence engine failed" },
      { status: 500 },
    );
  }
}
