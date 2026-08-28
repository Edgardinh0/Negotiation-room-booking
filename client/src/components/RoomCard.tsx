import { LuUsers, LuClock } from 'react-icons/lu';
import type { Room } from '@/types/api';
import '@/styles/roomcard.css';

interface RoomCardProps {
  room: Room;
  available?: boolean;
  statusText?: string;
  onDetailClick?: (id: string) => void;
  onBookClick?: (id: string) => void;
}

export function RoomCard({ room, statusText = 'Свободна весь день', onDetailClick, onBookClick }: RoomCardProps) {
    
    const status = room.statusText ?? statusText
  
    return (
    <div className="room-card">
      <div className="room-card-header">
        <h3 className="room-title">{room.name}</h3>
        <span className="room-floor">{room.floor} этаж</span>
      </div>

      <div className="room-info-list">
        <div className="info-item">
          <LuUsers className="info-icon" />
          <span>Вместимость: до {room.capacity} человек</span>
        </div>
        <div className="info-item">
          <LuClock className="info-icon" />
          <span>{status}</span>
        </div>
      </div>

      <div className={`status-badge ${room.available ? 'available' : 'unavailable'}`}>
        <span className="status-dot" />
        {room.available ? 'Доступно на выбранное время' : 'Недоступно на выбранное время'}
      </div>

      <div className="room-card-actions">
        <button
          type="button"
          className="btn-text"
          onClick={() => onDetailClick?.(room.id)}
        >
          Подробнее
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!room.available}
          onClick={() => onBookClick?.(room.id)}
        >
          Забронировать
        </button>
      </div>
    </div>
  );
}