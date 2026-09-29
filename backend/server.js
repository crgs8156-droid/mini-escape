const express = require("express");
const cors = require("cors");

const ROOMS = [
  {
    id: 1,
    name: "Output Gate",
    description: "The terminal glitches. Predict what the machine prints.",
    puzzles: [
      {
        id: 101,
        question: 'What does console.log(2 + "2") print?',
        hint: "One of the operands is a string.",
        answer: "22",
      },
    ],
  },
  {
    id: 2,
    name: "Loop Vault",
    description: "A lock that opens only for the loop that ticks exactly three times.",
    puzzles: [
      {
        id: 201,
        question: "Which loop body runs exactly 3 times?",
        options: [
          "for (let i = 1; i < 3; i++)",
          "for (let i = 0; i < 3; i++)",
          "for (let i = 0; i <= 3; i++)",
          "for (let i = 3; i > 0; i--) i starts at 0",
        ],
        correctOption: 1,
        hint: "Count from 0 inclusive to 3 exclusive.",
        answer: "for (let i = 0; i < 3; i++)",
      },
    ],
  },
  {
    id: 3,
    name: "Condition Core",
    description: "The last gate. One assignment hides as a comparison.",
    puzzles: [
      {
        id: 301,
        question: "Rewrite if (x = 5) as a comparison. Answer with the operator only.",
        hint: "Assignment != comparison.",
        answer: "==",
      },
    ],
  },
];

const players = new Map();
let nextPlayerId = 1;

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/rooms", (_req, res) =>
  res.json(ROOMS.map(({ id, name }) => ({ id, name })))
);

app.get("/rooms/:id", (req, res) => {
  const room = ROOMS.find((r) => r.id === Number(req.params.id));
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json({
    id: room.id,
    name: room.name,
    description: room.description,
    puzzles: room.puzzles.map(({ id, question, hint, options }) => ({
      id,
      question,
      hint,
      options: options || null,
    })),
  });
});

app.post("/puzzles/:id/check", (req, res) => {
  const puzzle = ROOMS.flatMap((r) => r.puzzles).find(
    (p) => p.id === Number(req.params.id)
  );
  if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });
  const correct =
    String(req.body?.answer ?? "").trim().toLowerCase() ===
    puzzle.answer.toLowerCase();
  if (puzzle.correctOption !== undefined) {
    const idx = Number(req.body?.answer);
    const optionCorrect = idx === puzzle.correctOption;
    return res.json({ correct: optionCorrect });
  }
  res.json({ correct });
});

app.post("/players", (req, res) => {
  const username = String(req.body?.username ?? "").trim();
  if (username.length < 2 || username.length > 20)
    return res.status(400).json({ error: "username must be 2-20 chars" });
  const id = `p${nextPlayerId++}`;
  players.set(id, username);
  res.json({ id, username });
});

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, _req, res, _next) => res.status(500).json({ error: "Server error" }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`mini-escape backend on :${PORT}`));
