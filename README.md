# NewsFlash

A morning news aggregator that fetches articles across 6 categories, displays them as flashcards with grid/list toggle, reads articles aloud via TTS, and summarizes them with AI. All storage is local SQLite with 7-day auto-clean.

## Categories

- Nigerian Politics
- World News
- Tech News
- Investment Banking
- Finance
- Soccer

## Features

- **RSS feed aggregation** — 18 sources across 6 categories; full article content extracted via Mozilla Readability
- **Flashcard UI** — grid or list view with image/gradient fallback, source badge, time-ago timestamps
- **Text-to-Speech** — play/pause/resume/stop with selectable voice and speed (0.9x–1.4x)
- **AI Summary** — summarizes any article via Gemini Flash (free tier)
- **Category tabs** — filter articles; selection persists through article navigation
- **Daily auto-clean** — articles older than 7 days are deleted automatically
- **Dark mode** — respects `prefers-color-scheme`

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/refresh` | POST | Fetches all sources immediately |
| `/api/cron?key=SECRET` | GET | Auth-protected cron trigger (set `CRON_SECRET` env) |
| `/api/news?category=&page=&limit=` | GET | Paginated article data |
| `/api/summarize` | POST | AI summary via Gemini (`{ id }`) |
| `/api/health` | GET | Health check |

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # Add GEMINI_API_KEY and CRON_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Fetch News Now** to populate articles.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CRON_SECRET` | Yes | Shared secret for `/api/cron` auth |
| `GEMINI_API_KEY` | For AI Summary | Free key from https://aistudio.google.com/apikey |

## RSS Sources

All sources are defined in `src/lib/sources.ts` — add more by appending to the array. Each source needs a name, RSS URL, and category slug.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- SQLite via better-sqlite3
- Mozilla Readability + jsdom for full-text extraction
- @google/genai for AI summaries
- Web Speech API for TTS

## Deployment

Deploy to Render. Ensure `CRON_SECRET` and `GEMINI_API_KEY` are set as environment variables.

Set up a daily cron job at cron-job.org pointing to:
```
https://your-app.onrender.com/api/cron?key=YOUR_CRON_SECRET
```
