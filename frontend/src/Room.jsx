import { useEffect, useState } from "react";

const TOTAL_SECONDS = 30;

function isCorrect(puzzle, answer) {
  if (puzzle.options) return Number(answer) === puzzle.correctOption;
  return answer.trim().toLowerCase() === puzzle.answer.trim().toLowerCase();
}

export default function Room({ room, roomNumber, totalRooms, onSolved, onDeadEnd, onRestart }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  useEffect(() => {
    if (seconds <= 0 && !feedback) {
      setFeedback("Time's up — the run ends here.");
      setTimeout(onDeadEnd, 1200);
    }
  }, [seconds, feedback, onDeadEnd]);

  function submit(e) {
    e.preventDefault();
    if (feedback || !answer.trim()) return;
    if (isCorrect(room.puzzles[0], answer)) {
      onSolved();
    } else {
      setFeedback("Wrong — the run ends here.");
      setTimeout(onDeadEnd, 1200);
    }
  }

  const puzzle = room.puzzles[0];

  return (
    <div className="card">
      <header>
        <h1>{room.name}</h1>
        <p className="meta">
          Room {roomNumber}/{totalRooms} · {seconds}s left
        </p>
      </header>
      <p className="desc">{room.description}</p>
      <p className="question">{puzzle.question}</p>

      {puzzle.options ? (
        puzzle.options.map((opt, i) => (
          <label key={i} className="option">
            <input
              type="radio"
              name="answer"
              value={i}
              checked={answer === String(i)}
              onChange={() => setAnswer(String(i))}
            />
            {opt}
          </label>
        ))
      ) : (
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="your answer"
          autoFocus
        />
      )}

      {showHint && <p className="hint">Hint: {puzzle.hint}</p>}

      <div className="row">
        <button onClick={submit} disabled={!!feedback}>
          Submit
        </button>
        <button className="secondary" onClick={() => setShowHint(true)}>
          Show hint
        </button>
        <button className="secondary" onClick={onRestart}>
          Start over
        </button>
      </div>
      {feedback && <p className="status">{feedback}</p>}
    </div>
  );
}
