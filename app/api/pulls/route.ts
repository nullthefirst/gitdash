import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get("repoUrl");
  const state = searchParams.get("state") || "open"; // 'open' or 'closed'

  if (!repoUrl) {
    return NextResponse.json(
      { error: "Repository URL is required" },
      { status: 400 },
    );
  }

  try {
    const urlParts = repoUrl.replace("https://github.com/", "").split("/");
    const [owner, repo] = urlParts;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
