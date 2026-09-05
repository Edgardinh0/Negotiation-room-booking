// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingsPage from '@/pages/BookingsPage';
import * as useUserBookingsModule from '@/hooks/useUserBookings';
import * as useCancelBookingModule from '@/hooks/useCancelBooking';

// Мокаем кастомные хуки
vi.mock('@/hooks/useUserBookings');
vi.mock('@/hooks/useCancelBooking');

// Мокаем дочерние компоненты
vi.mock('@/components/BookingOfficeSelector', () => ({
  BookingOfficeSelector: () => <div data-testid="office-selector">OfficeSelector</div>,
}));

vi.mock('@/components/DateRangeDropdown', () => ({
  DateRangeDropdown: () => <div data-testid="date-dropdown">DateRangeDropdown</div>,
}));

vi.mock('@/components/BookingCardSkeleton', () => ({
  BookingCardSkeleton: () => <div data-testid="skeleton">Skeleton Loading...</div>,
}));

vi.mock('@/components/EmptyBookingsState', () => ({
  EmptyBookingsState: () => <div data-testid="empty-state">Нет бронирований</div>,
}));

vi.mock('@/components/ErrorState', () => ({
  ErrorState: () => <div data-testid="error-state">Ошибка загрузки</div>,
}));

vi.mock('@/components/BookingCard', () => ({
  default: ({ booking, onCancelClick }: any) => (
    <div data-testid={`booking-card-${booking.id}`}>
      <span>{booking.roomName}</span>
      <button onClick={() => onCancelClick(booking)}>Отменить</button>
    </div>
  ),
}));

vi.mock('@/components/CancelBookingModal', () => ({
  default: ({ onClose, onConfirm }: any) => (
    <div data-testid="cancel-modal">
      <button onClick={onConfirm}>Подтвердить отмену</button>
      <button onClick={onClose}>Отмена</button>
    </div>
  ),
}));

describe('BookingsPage', () => {
  const mockBookings = [
    {
      id: 'b-1',
      startsAt: new Date().toISOString(),
      roomName: 'Переговорная 101',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useCancelBookingModule, 'default').mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as any);
  });

  it('отображает скелетон во время загрузки данных', () => {
    vi.spyOn(useUserBookingsModule, 'useUserBookings').mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<BookingsPage />);

    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });

  it('отображает состояние ошибки при неудачном запросе', () => {
    vi.spyOn(useUserBookingsModule, 'useUserBookings').mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    } as any);

    render(<BookingsPage />);

    expect(screen.getByTestId('error-state')).toBeTruthy();
  });

  it('отображает пустую заглушку, если список бронирований пуст', () => {
    vi.spyOn(useUserBookingsModule, 'useUserBookings').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<BookingsPage />);

    expect(screen.getByTestId('empty-state')).toBeTruthy();
  });

  it('отображает список бронирований и переключает табы', () => {
  const mockUseUserBookings = vi
    .spyOn(useUserBookingsModule, 'useUserBookings')
    .mockReturnValue({
      data: mockBookings,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

  render(<BookingsPage />);

  expect(screen.getByTestId('booking-card-b-1')).toBeTruthy();

  // Берем первую кнопку "Прошедшие"
  const pastTabBtns = screen.getAllByRole('button', { name: /прошедшие/i });
  fireEvent.click(pastTabBtns[0]);

  expect(mockUseUserBookings).toHaveBeenLastCalledWith(
    expect.objectContaining({ scope: 'past' })
  );
});

  it('открывает модальное окно отмены бронирования при клике на кнопку', () => {
    vi.spyOn(useUserBookingsModule, 'useUserBookings').mockReturnValue({
      data: mockBookings,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<BookingsPage />);

    const cancelBtn = screen.getAllByRole('button', { name: /отменить/i });
    fireEvent.click(cancelBtn[0]);

    expect(screen.getByTestId('cancel-modal')).toBeTruthy();
  });
});