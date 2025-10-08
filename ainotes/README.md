## AI Notes (ADHD-friendly) – Monorepo

This workspace contains a local-first AI-powered note-taking app designed for ADHD founders. It focuses on quick capture, minimal friction, and smart AI assist for summarizing, extracting action items, and daily planning.

### Apps
- `web`: Vite + React + Tailwind PWA using IndexedDB for local-first storage
- `server`: Express proxy for AI calls (keeps your API key on the server)

### Quick Start

1. Copy env and set your OpenAI API key:
```bash
cp server/.env.example server/.env
```
Fill `OPENAI_API_KEY` in `server/.env`.

2. Install deps at root (uses npm workspaces):
```bash
npm install
```

3. Run both apps:
```bash
npm run dev
```
Web app will be at `http://localhost:5173` and server at `http://localhost:8787`.

### Key Features
- Quick Capture modal (hotkey Alt+N) and optional voice dictation
- AI Summarize, Extract Tasks, and Plan My Day
- Local-first storage with IndexedDB (offline-friendly)
- Fuzzy search with tag filters
- Focus mode timer and Daily Planner
- PWA manifest + simple service worker

### Monorepo Scripts
- `npm run dev` – runs `server` and `web` together
- `npm run build` – builds both
- `npm run start` – starts server and web preview

### Environment
- `server/.env` requires `OPENAI_API_KEY`

