# GitDash — GitHub Repository Intelligence Dashboard

GitDash is a high-density intelligence dashboard that allows users to analyze public GitHub repositories. It fetches pull requests and utilizes Groq Cloud AI to generate instant, technical summaries of code changes (diffs).

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- Clone the repository:

```Bash
git clone [https://github.com/your-username/gitdash.git](https://github.com/your-username/gitdash.git)

cd gitdash
```

- Install dependencies:

```Bash
pnpm install
```

- Set up Environment Variables:

Configure your .env.local as shown below.

- Run the development server:

```Bash
pnpm run dev
```

- Open the app:

Navigate to http://localhost:3000.

## 🚀 Features

- **Repository Analysis:** Input any public GitHub URL to initialize a dashboard.
- **AI Summarization:** Powered by Groq **Compound** models to summarize PR diffs into concise technical insights.
- **Live Filtering:** Toggle between 'Open' and 'Closed' pull requests in real-time.
- **Modern UI:** Built with Next.js 14 App Router and Tailwind CSS, replicating terminal-precision design.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide React.
- **Backend:** Next.js Route Handlers (Server-side API).
- **AI Engine:** Groq Cloud SDK (`groq/compound` or `groq/compound-mini`).
- **API Integration:** GitHub REST API.

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js 18.x** or later installed.
- A **GitHub Personal Access Token** (Classic or Fine-grained) with `public_repo` scope.
- A **Groq Cloud API Key** with access to Compound models (obtainable at [console.groq.com](https://console.groq.com)).

---

## ⚙️ Environment Variables

Create a file named `.env.local` in the root directory and add the following:

```env
# GitHub Personal Access Token for API calls
GITHUB_TOKEN=your_github_token_here

# Groq Cloud API Key for AI summarization
GROQ_API_KEY=your_groq_api_key_here
```
