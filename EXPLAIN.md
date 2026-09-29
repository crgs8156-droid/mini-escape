# EXPLAIN — viva map for the big codebase

How to comprehend ~5000 lines of EscapeByte by reading ~330 lines here first.

## Mental model (draw this on the board)

    [ Next.js + React (App.jsx state router) ]
         |  fetch JSON only
         v
    [ Express server.js — 4 routes ]
         |
         v
    [ ROOMS array in memory ]   answers NEVER sent to browser

Every screen is a value of one state variable; every click is a fetch.

## File-by-file map: mini -> original

| Mini (read first)          | Original (same idea, fuller)             |
|----------------------------|------------------------------------------|
| backend/server.js          | backend/src/server.js (554) + db.js (802) — here ROOMS replaces the dual-mode Postgres/in-memory db.js |
| frontend/src/App.jsx       | frontend/src/App.jsx:30-252 — identical state-router pattern, fewer flags |
| frontend/src/Lobby.jsx     | no direct counterpart — visible lock/unlock gating (the full app advances rooms automatically) |
| frontend/src/Room.jsx      | frontend/src/views/Room.jsx (290) — countdown + checkAnswer + DeadEnd, minus tab-switch/audio/CSS |
| frontend/src/serverClient.js | frontend/src/serverClient.js (130) — same fetch wrapper idea |
| frontend/src/index.css (~60) | frontend/src/index.css (1081) — same variable-driven theming, 5 vars |

## The 5-minute talk track

1. "Solving the room is 4 HTTP calls." — `GET /rooms` (ordered list),
   `GET /rooms/:id` (question + hint, **no answer**), `POST /puzzles/:id/check`
   -> `{correct}`, `POST /players` (username signup).
2. "Routing is just state." — `App.jsx` holds `roomIndex`; solving room 3 sets
   `completed`. The Next.js App Router has a single route (`app/page.jsx`); all
   screen switching inside it is plain `useState` — refresh resets by design.
   Two modes share the same rooms: **Classic Run** auto-advances, **Sequential
   Run** shows a `Lobby.jsx` where room N+1 is locked until room N is cleared.
3. "Gating is client state." — `Lobby.jsx` unlocks room N+1 by checking
   `clearedIds` in App state; the backend never arbitrates order (fine for a
   demo, a real product would enforce it server-side).
4. "Security idea in one line." — answers live in the `ROOMS` array server-side;
   the client grades nothing meaningful, it can't peek.
5. "Scale path." — original adds: real Postgres via parameterized `pg` SQL
   (dual-mode with in-memory fallback), 10 tables, a whole quiz mode
   (create/join/take/results), contexts for two player types, 1k lines of CSS
   theme. Same shape, more features.

## Why the full app is 5000 lines but only ~700 matter for viva

- `index.css` 1081 + quiz views 811 + `db.js` 802: explain as *concepts*
  (theme variables, soft-fail quiz mode, dual-mode DAL), not line-by-line.
- Core loop you should be able to whiteboard: `App.jsx`, `Room.jsx`,
  `server.js` escape-room routes, 3 tables (`players`, `rooms`, `puzzles`).
