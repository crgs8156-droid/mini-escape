import { useEffect, useState } from "react";
import { getRoom, checkAnswer } from "./serverClient.js";

const TOTAL_SECONDS = 30;

export default function Room({ room, roomNumber, totalRooms, onSolved, onDeadEnd, onRestart }) {
  const [detail, setDetail] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  useEffect(() => {
    getRoom(room.id)
      .then(setDetail)
      .catch((e) => setFeedback(`Error: ${e.message}`));
  }, [room.id]);

  useEffect(() => {
    if (!detail || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [detail, seconds]);

  useEffect(() => {
    if (seconds <= 0 && detail && !feedback) {
      setFeedback("Time's up — the run ends here.");
      setTimeout(onDeadEnd, 1200);
    }
  }, [seconds, detail, feedback, onDeadEnd]);

  async function submit(e) {
    e.preventDefault();
    if (!detail || feedback || !answer.trim()) return;
    try {
      const { correct } = await checkAnswer(
        detail.puzzles[0].id,
        detail.puzzles[0].options ? Number(answer) : answer
      );
      if (correct) onSolved();
      else {
        setFeedback("Wrong — the run ends here.");
        setTimeout(onDeadEnd, 1200);
      }
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  }

  if (!detail) return <p className="status">Entering room…</p>;

  const puzzle = detail.puzzles[0];

  return (
    <div className="card">
      <header>
        <h1>{detail.name}</h1>
        <p className="meta">
          Room {roomNumber}/{totalRooms} · {seconds}s left
        </p>
      </header>
      <p className="desc">{detail.description}</p>
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
