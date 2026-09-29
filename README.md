# Mini Escape (teaching build)

A deliberately tiny escape room: **3 rooms, 1 programming puzzle each**, built as a
single **Next.js (App Router) + React** app — **no backend, no database, and no APIs
of any kind.**

All game data (rooms, puzzles, answers) lives in `frontend/src/data/rooms.js` and
grading happens in the browser.

## Run it

Terminal (frontend only):

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

Nothing else to start — the app is fully client-side and offline.

## What it shows

- Frontend state routing with `useState` only (no router): Start -> Room 1 -> 2 -> 3 -> Escaped / Dead End.
- Two modes from the Start screen:
  - **Classic Run** — auto-advances room by room.
  - **Sequential Run** — a lobby page (`Lobby.jsx`) where room 2 is locked until
    room 1 is cleared, and room 3 stays locked until room 2 is cleared.
- 30s countdown per room; wrong answer or timeout ends the run (strict 1-strike).
- 100% offline: no `fetch`, no HTTP, no external service.

## No APIs — by design

To meet the "no APIs" constraint, the earlier Express backend was removed. The
trade-off: puzzle answers are stored in the frontend bundle and are visible in the
browser (DevTools) — there is no server to hide them. That is acceptable here because
nothing is scored online and there is no leaderboard.

## Puzzles

1. `console.log(2 + "2")` — answer `22` (string concatenation).
2. Which `for` loop runs exactly 3 times — MCQ.
3. `if (x = 5)` fix — answer `==` (comparison, not assignment).
