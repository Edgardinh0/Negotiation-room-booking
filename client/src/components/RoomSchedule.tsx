import { LuCalendar as CalendarIcon } from "react-icons/lu";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import '@/styles/roomschedule.css'

registerLocale("ru", ru);

export interface BookingSlot {
  id: string;
  title?: string;
  startTime: string;
  endTime: string;
  isMine?: boolean;
}

interface RoomScheduleProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
  bookings: BookingSlot[];
  onBookClick: () => void;
}

const HOURS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Перевод HH:mm в минуты с начала дня 09:00
const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return (h - 9) * 60 + m;
};

export function RoomSchedule({
  selectedDate,
  onDateChange,
  bookings,
  onBookClick,
}: RoomScheduleProps) {
  const formattedDateHeader = format(selectedDate, "EEEE, d MMMM", { locale: ru });
  const capitalizedDate = formattedDateHeader.charAt(0).toUpperCase() + formattedDateHeader.slice(1);

  // Высота одного часа (60 минут) в px
  const HOUR_HEIGHT = 56;
  const TOTAL_HOURS = 11; // с 09:00 до 20:00

  return (
    <div className="room-schedule-card">
      <div className="schedule-header">
        <div>
          <h2 className="schedule-title">Расписание на день</h2>
          <p className="schedule-date-subtitle">{capitalizedDate}</p>
        </div>

        <div className="date-picker-button-wrapper">
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="d MMMM, EE"
            locale="ru"
            customInput={
              <button type="button" className="schedule-date-btn">
                <CalendarIcon />
                <span>Выбрать дату</span>
              </button>
            }
          />
        </div>
      </div>

      <div className="timeline-container">
        <div className="timeline-grid" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
          {HOURS.map((hour, index) => (
            <div key={hour} className="timeline-hour-row" style={{ top: `${index * HOUR_HEIGHT}px` }}>
              <span className="hour-label">{hour}</span>
              <div className="hour-line" />
            </div>
          ))}

          {/* Отрисовка забронированных слотов */}
          {bookings.map((slot) => {
            const startMin = timeToMinutes(slot.startTime);
            const endMin = timeToMinutes(slot.endTime);
            const top = (startMin / 60) * HOUR_HEIGHT;
            const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;

            return (
              <div
                key={slot.id}
                className={`booking-slot-block ${slot.isMine ? "my-booking" : "other-booking"}`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
              >
                {slot.isMine ? (
                  <span className="slot-title">{slot.title || "Моя встреча"}</span>
                ) : (
                  <span className="slot-title">Занято</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="schedule-footer">
        <button type="button" className="book-room-primary-btn" onClick={onBookClick}>
          Забронировать комнату
        </button>
      </div>
    </div>
  );
}