# Mini Escape (teaching build)

A deliberately tiny version of EscapeByte: **3 rooms, 1 programming puzzle each,
in-memory Express backend, Next.js (App Router) + React frontend.**

Purpose: a version small enough to read line-by-line and explain in a viva,
while showing the same core ideas as the full app.

## Run it

Terminal 1 (backend, port 4001):

    cd backend
    npm install
    npm start

Terminal 2 (frontend, port 5173):

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

## What it shows

- Frontend state routing with `useState` only (no router): Start -> Room 1 -> 2 -> 3 -> Escaped / Dead End.
- Two modes from the Start screen:
  - **Classic Run** — auto-advances room by room.
  - **Sequential Run** — a lobby page (`Lobby.jsx`) where room 2 is locked until
    room 1 is cleared, and room 3 stays locked until room 2 is cleared.
- Backend keeps answers server-side; the browser only ever receives `{ correct: boolean }`.
- 30s countdown per room; wrong answer or timeout ends the run (strict 1-strike, like the main game).
- In-memory data only — no database, refresh wipes state by design.

## Puzzles

1. `console.log(2 + "2")` — answer `22` (string concatenation).
2. Which `for` loop runs exactly 3 times — MCQ (0..2).
3. `if (x = 5)` fix — answer `==` (comparison, not assignment).
