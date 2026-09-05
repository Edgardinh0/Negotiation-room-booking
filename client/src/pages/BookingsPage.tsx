import { useState, useMemo } from 'react';
import { BookingOfficeSelector } from '@/components/BookingOfficeSelector';
import { DateRangeDropdown, type TimeRange } from '@/components/DateRangeDropdown';
import BookingCard from '@/components/BookingCard';
import CancelBookingModal from '@/components/CancelBookingModal';
import type { Booking, Office } from '@/types/api';
import '@/styles/bookingspage.css';
import { EmptyBookingsState } from '@/components/EmptyBookingsState';

interface BookingsPageProps {
  offices?: Office[];
  bookings?: Booking[];
  onCancelBooking: (bookingId: string) => Promise<void>;
}

type TabType = 'active' | 'past';

export default function BookingsPage({ offices = [], bookings = [], onCancelBooking }: BookingsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<TimeRange>('all');
  
  // Состояние для модалки отмены
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  // Фильтрация бронирований по табу, офису и временному диапазону
  const filteredBookings = useMemo(() => {
    const now = new Date();

    return bookings.filter((booking) => {
      const startDate = new Date(booking.startsAt);
      
      // 1. Фильтр по табу (Активные / Прошедшие)
      const isPast = startDate < now;
      if (activeTab === 'active' && isPast) return false;
      if (activeTab === 'past' && !isPast) return false;

      // 2. Фильтр по офису
      if (selectedOfficeId !== 'all') {
        const officeId = booking.office?.id || booking.room?.office?.id;
        if (officeId !== selectedOfficeId) return false;
      }

      // 3. Фильтр по дате
      if (selectedRange === 'today') {
        const isToday = startDate.toDateString() === now.toDateString();
        if (!isToday) return false;
      } else if (selectedRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        if (startDate < weekAgo || startDate > now) return false;
      } else if (selectedRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        if (startDate < monthAgo || startDate > now) return false;
      }

      return true;
    });
  }, [bookings, activeTab, selectedOfficeId, selectedRange]);

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      setIsCanceling(true);
      await onCancelBooking(bookingToCancel.id);
      setBookingToCancel(null);
    } catch (error) {
      console.error('Ошибка отмены бронирования:', error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="bookings-page-container">
      {/* Шапка страницы */}
      <div className="bookings-page-header">
        <h1 className="bookings-page-title">Мои бронирования</h1>
        <div className="bookings-page-filters">
          <BookingOfficeSelector
            offices={offices}
            selectedOfficeId={selectedOfficeId}
            onSelect={setSelectedOfficeId}
          />
          <DateRangeDropdown
            selectedRange={selectedRange}
            onSelectRange={setSelectedRange}
          />
        </div>
      </div>

      {/* Переключатель табов */}
      <div className="bookings-tabs-bar">
        <button
          type="button"
          className={`bookings-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Предстоящие
        </button>
        <button
          type="button"
          className={`bookings-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Прошедшие
        </button>
      </div>

      {/* Список бронирований */}
      <div className="bookings-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isPast={activeTab === 'past'}
              onCancelClick={(b) => setBookingToCancel(b)}
            />
          ))
        ) : (
          <EmptyBookingsState />
        )}
      </div>

      {/* Модальное окно отмены */}
      {bookingToCancel && (
        <CancelBookingModal
          booking={bookingToCancel}
          isSubmitting={isCanceling}
          onClose={() => setBookingToCancel(null)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}