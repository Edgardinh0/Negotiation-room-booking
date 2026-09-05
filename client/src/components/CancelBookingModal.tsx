import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { LuCalendar, LuClock, LuMapPin } from 'react-icons/lu';
import type { Booking } from '@/types/api';
import '@/styles/cancelbookingmodal.css';

interface CancelBookingModalProps {
  booking: Booking;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelBookingModal({
  booking,
  isSubmitting = false,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const startDate = parseISO(booking.startsAt);
  const endDate = parseISO(booking.endsAt);

  const formattedDate = format(startDate, 'd MMMM, EEEE', { locale: ru });
  const timeRange = `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="cancel-modal-title">Отменить бронирование?</h2>
        <p className="cancel-modal-description">
          Вы уверены, что хотите отменить это бронирование? Данное действие нельзя будет отменить.
        </p>

        <div className="cancel-modal-summary-card">
          <div className="cancel-modal-summary-title">{booking.title || 'Без названия'}</div>
          <div className="cancel-modal-summary-info">
            <div className="cancel-modal-summary-item">
              <LuMapPin className="cancel-modal-summary-icon" />
              <span>
                {booking.office?.name || booking.room?.office?.name}, {booking.room?.floor} этаж
              </span>
            </div>
            <div className="cancel-modal-summary-item">
              <LuCalendar className="cancel-modal-summary-icon" />
              <span className="cancel-modal-capitalize">{formattedDate}</span>
            </div>
            <div className="cancel-modal-summary-item">
              <LuClock className="cancel-modal-summary-icon" />
              <span>{timeRange} МСК</span>
            </div>
          </div>
        </div>

        <div className="cancel-modal-actions">
          <button
            type="button"
            className="cancel-modal-btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Оставить
          </button>
          <button
            type="button"
            className="cancel-modal-btn-danger"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отмена...' : 'Да, отменить'}
          </button>
        </div>
      </div>
    </div>
  );
}