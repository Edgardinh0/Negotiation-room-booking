import '@/styles/roomskeleton.css'

function RoomSkeleton() {
  return (
    <div className="room-card skeleton-card">
      <div className="skeleton-line title" />
      <div className="skeleton-line subtitle" />
      <div className="skeleton-line info" />
      <div className="skeleton-line info" />
      <div className="skeleton-badge" />
      <div className="skeleton-actions">
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
      </div>
    </div>
  );
}

export default RoomSkeleton