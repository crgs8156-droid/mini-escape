export default function Lobby({ rooms, clearedIds, onEnter, onRestart }) {
  return (
    <div className="card">
      <h1>Sequential Run</h1>
      <p className="meta">
        Clear a room to unlock the next one. One wrong answer ends the run.
      </p>
      {rooms.map((room, index) => {
        const cleared = clearedIds.includes(room.id);
        const unlocked = index === 0 || clearedIds.includes(rooms[index - 1].id);
        return (
          <div key={room.id} className={`lobby-room${unlocked ? "" : " locked"}`}>
            <span className="badge">
              {cleared ? "Cleared" : unlocked ? "Unlocked" : "Locked"}
            </span>
            <span className="lobby-name">
              Room {index + 1}: {room.name}
            </span>
            <button
              disabled={!unlocked}
              className="secondary"
              onClick={() => onEnter(index)}
            >
              {cleared ? "Replay" : "Enter"}
            </button>
          </div>
        );
      })}
      <button className="secondary" onClick={onRestart}>
        Start over
      </button>
    </div>
  );
}
