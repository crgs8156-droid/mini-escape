const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4001";

async function call(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const getRooms = () => call("/rooms");
export const getRoom = (id) => call(`/rooms/${id}`);
export const checkAnswer = (puzzleId, answer) =>
  call(`/puzzles/${puzzleId}/check`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
export const createPlayer = (username) =>
  call("/players", { method: "POST", body: JSON.stringify({ username }) });
