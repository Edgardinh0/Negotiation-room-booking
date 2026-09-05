import { useState, useMemo } from 'react';
import { BookingOfficeSelector } from '@/components/BookingOfficeSelector';
import { DateRangeDropdown, type TimeRange } from '@/components/DateRangeDropdown';
import BookingCard from '@/components/BookingCard';
import CancelBookingModal from '@/components/CancelBookingModal';
import type { Booking } from '@/types/api';
import '@/styles/bookingspage.css';
import { EmptyBookingsState } from '@/components/EmptyBookingsState';
import { BookingCardSkeleton } from '@/components/BookingCardSkeleton';
import { useUserBookings, type BookingScope } from '@/hooks/useUserBookings';
import useCancelBooking from '@/hooks/useCancelBooking';
import { ErrorState } from '@/components/ErrorState';

type TabType = 'active' | 'past';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<TimeRange>('all');
  
  // Состояние для модалки отмены
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const scope: BookingScope = activeTab === 'active' ? 'upcoming' : 'past'
  const apiOfficeId = selectedOfficeId === 'all' ? undefined : selectedOfficeId

  const { data: bookings = [], isLoading, isError, refetch: refetchBookings} = useUserBookings({scope, officeId: apiOfficeId})

  const { mutateAsync: cancelBooking, isPending: isCanceling} = useCancelBooking()

  // Фильтрация бронирований по табу, офису и временному диапазону
  const filteredBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return []
    if (selectedRange === 'all') return bookings
    
    const now = new Date();

    return bookings.filter((booking) => {
      if (!booking?.startsAt) return false;
      const startDate = new Date(booking.startsAt);
      console.log(booking.id)

      if (selectedRange === 'today') {
        return startDate.toDateString() === now.toDateString();
      }
      
      if (selectedRange === 'week') {
        if (activeTab === 'active') {
          // Для предстоящих: от текущего момента до +7 дней вперед
          const endOfWeek = new Date(now);
          endOfWeek.setDate(now.getDate() + 7);
          return startDate >= now && startDate <= endOfWeek;
        } else {
          // Для прошедших: за последние 7 дней
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - 7);
          return startDate >= startOfWeek && startDate <= now;
        }
      }

      if (selectedRange === 'month') {
        if (activeTab === 'active') {
          // Для предстоящих: от текущего момента до +1 месяца вперед
          const endOfMonth = new Date(now);
          endOfMonth.setMonth(now.getMonth() + 1);
          return startDate >= now && startDate <= endOfMonth;
        } else {
          // Для прошедших: за последний 1 месяц
          const startOfMonth = new Date(now);
          startOfMonth.setMonth(now.getMonth() - 1);
          return startDate >= startOfMonth && startDate <= now;
        }
      }

      return true;
    });
  }, [bookings, selectedRange]);

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel.id)
      setBookingToCancel(null)
    } catch (error) {
      console.error('Ошибка отмены бронирования:', error);
    }
  };

  return (
    <div className="bookings-page-container">
      {/* Шапка страницы */}
      <div className="bookings-page-header">
        <h1 className="bookings-page-title">Мои бронирования</h1>
        <div className="bookings-page-filters">
          <BookingOfficeSelector
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
        {isLoading ? (
            <BookingCardSkeleton count={3} />
        ) : isError ? (
            <ErrorState 
                onRetry={() => refetchBookings()}
                title='Не удалось загрузить данные'  
                description='Произошла ошибка при загрузке ваших бронирований'  
            />
        ) : filteredBookings.length > 0 ? (
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