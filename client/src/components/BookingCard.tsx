import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import type { Booking } from '@/types/api';
import '@/styles/bookingcard.css';

interface BookingCardProps {
  booking: Booking;
  isPast?: boolean;
  onCancelClick?: (booking: Booking) => void;
}

export default function BookingCard({ booking, isPast = false, onCancelClick }: BookingCardProps) {
  const startDate = parseISO(booking.startsAt);
  const endDate = parseISO(booking.endsAt);

  const monthName = format(startDate, 'LLLL', { locale: ru }).toUpperCase();
  const dayNumber = format(startDate, 'd');
  const timeRange = `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;

  return (
    <div className={`booking-card-wrapper ${isPast ? 'past' : ''}`}>
      <div className="booking-card-date-badge">
        <span className="booking-card-month-label">{monthName}</span>
        <span className="booking-card-day-number">{dayNumber}</span>
      </div>

      <div className="booking-card-details-content">
        <h3 className="booking-card-title">{booking.title || 'Без названия'}</h3>
        <div className="booking-card-meta">
          <span>{booking.office?.name || booking.room?.office?.name}</span>
          <span className="booking-card-dot">•</span>
          <span>{booking.room?.floor} этаж</span>
          <span className="booking-card-dot">•</span>
          <span>{timeRange} МСК</span>
        </div>
      </div>

      {!isPast && (
        <div className="booking-card-actions">
          <button
            type="button"
            className="booking-card-btn-cancel"
            onClick={() => onCancelClick?.(booking)}
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  );
}