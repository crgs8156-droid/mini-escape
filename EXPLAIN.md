# EXPLAIN — how Mini Escape works

## Mental model

    [ Next.js + React (App.jsx state router) ]
                    |
                    v
    [ frontend/src/data/rooms.js — rooms, puzzles, answers ]
       (all in the browser; no server, no fetch, no APIs)

Every screen is a value of one state variable; every click changes local state.

## Read these, in order

| File | Role |
|------|------|
| `frontend/src/data/rooms.js` | the 3 rooms + puzzles + answers (local data) |
| `frontend/src/App.jsx` | state router: start / game / done / dead; two modes |
| `frontend/src/Room.jsx` | one room: 30s countdown, hint, local grading |
| `frontend/src/Lobby.jsx` | Sequential Run: lock/unlock rooms |
| `frontend/app/layout.jsx` + `page.jsx` | Next.js entry; global CSS; single client route |
| `frontend/src/index.css` | dark theme |

## The 5-minute talk track

1. **"There is no backend."** — rooms, puzzles and answers live in
   `src/data/rooms.js`; the app never makes a network call.
2. **"Routing is just state."** — `App.jsx` holds `mode`, `roomIndex` and
   `activeRoom`; there is no router, and refresh resets the run.
3. **"Grading is local."** — `Room.jsx` compares the answer in the browser
   (MCQ by option index; free text trimmed + case-insensitive).
4. **"Two modes."** — Classic Run auto-advances; Sequential Run shows
   `Lobby.jsx`, where room N+1 is locked until room N is cleared.
5. **"Strict fail."** — a wrong answer or the 30s timeout ends the run (Dead End).

## Consequence of "no APIs"

Answers are in the browser bundle and readable via DevTools. With no server there
is nothing to hide them from; this is acceptable here because there is no online
score and no leaderboard.
