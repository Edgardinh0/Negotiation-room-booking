import { useNavigate } from "react-router-dom";
import { LuCalendarOff } from "react-icons/lu";
import '@/styles/emptystate.css'


export function EmptyBookingsState() {
  const navigate = useNavigate();

  return (
    <div className="empty-rooms-container">
      <div className="empty-icon-circle">
        <LuCalendarOff className="empty-icon"/>
      </div>
      <h2 className="empty-title">Нет бронирований</h2>
      <p className="empty-subtitle">
        У вас пока нет предстоящих бронирований.<br />
        Перейдите в раздел переговорных, чтобы забронировать комнату.
      </p>
      <button type="button" className="btn-reset" onClick={() => navigate("/")}>
        Перейти к переговорным
      </button>
    </div>
  );
}