import { useRoomBookings } from '@/hooks/useRoomBookings';
import { LuUsers, LuClock } from 'react-icons/lu';
import type { Room } from '@/types/api';
import '@/styles/roomcard.css';
import { endOfDay, isBefore, parseISO, startOfDay } from 'date-fns';

interface RoomCardProps {
  room: Room;
  from?: string,
  to?: string,
  onDetailClick?: (id: string) => void;
  onBookClick?: (id: string) => void;
}

export function RoomCard({ room, from, to, onDetailClick, onBookClick }: RoomCardProps) {
  const now = new Date()

  const filterStart = from ? parseISO(from) : now
  const filterEnd = to ? parseISO(to) : new Date(filterStart.getTime() + 60 * 60 * 1000) 

  //Границы текущих суток
  const dayStartIso = startOfDay(filterStart).toISOString()
  const dayEndIso = endOfDay(filterStart).toISOString()

  const { data: slots = []} = useRoomBookings({
    roomId: room.id,
    from: dayStartIso,
    to: dayEndIso
  })

  //Прошла ли дата из фильтра 
  const isPastTime = isBefore(filterStart, now)

  //Форматируем время фильтра в HH:mm для сравнения со слотами
  const filterStartHHMM = filterStart ? `${String(filterStart.getHours()).padStart(2, '0')}:${String(filterStart.getMinutes()).padStart(2, '0')}` : null
  const filterEndHHMM = filterEnd ? `${String(filterEnd.getHours()).padStart(2, '0')}:${String(filterEnd.getMinutes()).padStart(2, '0')}` : null

  //Ищем пересечение интервалов и слотов
  const conflictSlot = slots.find((slot) => {
    if (!filterStartHHMM || !filterEndHHMM) return false
    return filterStartHHMM < slot.endTime && filterEndHHMM > slot.startTime
  })

  const isAvailable = !isPastTime && !conflictSlot


  //Формируем текст статуса
  let statusText = 'Доступна весь день'

  if (isPastTime) {
    statusText = 'Указанное время прошло'
  } else if (conflictSlot) {
    statusText = `Занята до ${conflictSlot.endTime}`
  } else if (filterStartHHMM) {
    const nextSlot = [...slots].filter((s) => s.startTime >= filterStartHHMM).sort((a,b) => a.startTime.localeCompare(b.startTime))[0]
    if (nextSlot) {
      statusText = `Доступна до ${nextSlot.startTime}`
    }
  }
  
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
          <span>{statusText}</span>
        </div>
      </div>

      <div className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
        <span className="status-dot" />
        {isAvailable ? 'Доступно на выбранное время' : 'Недоступно на выбранное время'}
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
          disabled={!isAvailable}
          onClick={() => onBookClick?.(room.id)}
        >
          Забронировать
        </button>
      </div>
    </div>
  );
}