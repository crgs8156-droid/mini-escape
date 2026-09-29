import { useEffect, useState } from "react";
import Room from "./Room.jsx";
import Lobby from "./Lobby.jsx";
import { getRooms, createPlayer } from "./serverClient.js";

export default function App() {
  const [player, setPlayer] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomIndex, setRoomIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [deadEnd, setDeadEnd] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [clearedIds, setClearedIds] = useState([]);

  useEffect(() => {
    if (!started) return;
    fetchRooms();
  }, [started]);

  async function fetchRooms() {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function begin(e) {
    e.preventDefault();
    try {
      const p = await createPlayer(username.trim());
      setPlayer(p);
      setStarted(true);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSolved() {
    if (roomIndex + 1 < rooms.length) setRoomIndex(roomIndex + 1);
    else setCompleted(true);
  }

  function handleGatedSolved(index) {
    const roomId = rooms[index].id;
    const cleared = clearedIds.includes(roomId)
      ? clearedIds
      : [...clearedIds, roomId];
    setClearedIds(cleared);
    setActiveRoom(null);
    if (cleared.length === rooms.length) setCompleted(true);
  }

  function restart() {
    setPlayer(null);
    setRooms([]);
    setRoomIndex(0);
    setStarted(false);
    setCompleted(false);
    setDeadEnd(false);
    setError("");
    setUsername("");
    setMode(null);
    setActiveRoom(null);
    setClearedIds([]);
  }

  if (error) return <p className="status">Error: {error}</p>;

  if (completed)
    return (
      <div className="card">
        <h1>Escaped!</h1>
        <p>All three gates cleared.</p>
        <button onClick={restart}>Play again</button>
      </div>
    );

  if (deadEnd)
    return (
      <div className="card">
        <h1>Dead End</h1>
        <p>One wrong answer ends the run.</p>
        <button onClick={restart}>Try again</button>
      </div>
    );

  if (started && rooms.length > 0 && mode === "gated") {
    if (activeRoom !== null)
      return (
        <Room
          key={activeRoom}
          room={rooms[activeRoom]}
          roomNumber={activeRoom + 1}
          totalRooms={rooms.length}
          onSolved={() => handleGatedSolved(activeRoom)}
          onDeadEnd={() => setDeadEnd(true)}
          onRestart={restart}
        />
      );
    return (
      <Lobby
        rooms={rooms}
        clearedIds={clearedIds}
        onEnter={setActiveRoom}
        onRestart={restart}
      />
    );
  }

  if (started && rooms.length > 0)
    return (
      <Room
        key={roomIndex}
        room={rooms[roomIndex]}
        roomNumber={roomIndex + 1}
        totalRooms={rooms.length}
        onSolved={handleSolved}
        onDeadEnd={() => setDeadEnd(true)}
        onRestart={restart}
      />
    );

  return (
    <form className="card" onSubmit={begin}>
      <h1>Mini Escape</h1>
      <p>Three rooms, three code puzzles. One wrong answer ends the run.</p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        minLength={2}
        maxLength={20}
        required
      />
      <div className="row">
        <button type="submit" onClick={() => setMode("classic")}>
          Classic Run
        </button>
        <button
          type="submit"
          className="secondary"
          onClick={() => setMode("gated")}
        >
          Sequential Run
        </button>
      </div>
    </form>
  );
}
