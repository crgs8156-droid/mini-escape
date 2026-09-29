// All game data lives in the browser now — no server, no API calls.
// Answers are plaintext here by design: the app is offline and single-machine,
// so there is nothing to hide them from. (A server used to keep them secret;
// that backend was removed to meet the "no APIs" constraint.)
export const ROOMS = [
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
