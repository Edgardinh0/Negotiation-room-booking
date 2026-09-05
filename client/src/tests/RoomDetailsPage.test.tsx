// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoomDetailsPage from '@/pages/RoomDetailsPage';
import * as useRoomDetailsModule from '@/hooks/useRoomDetails';
import * as useRoomBookingsModule from '@/hooks/useRoomBookings';
import { useQuery } from '@tanstack/react-query';

// 1. Мокаем роутер
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ roomId: 'room-1' }),
  useNavigate: () => mockNavigate,
}));

// 2. Мокаем TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// 3. Мокаем кастомные хуки
vi.mock('@/hooks/useRoomDetails');
vi.mock('@/hooks/useRoomBookings');

// 4. Мокаем дочерние компоненты
vi.mock('@/components/RoomDetailSkeleton', () => ({
  RoomDetailSkeleton: () => <div data-testid="room-detail-skeleton">Загрузка...</div>,
}));

vi.mock('@/components/ErrorState', () => ({
  ErrorState: ({ title, description, onRetry }: any) => (
    <div data-testid="error-state">
      <span>{title}</span>
      <p>{description}</p>
      <button type="button" data-testid="retry-btn" onClick={onRetry}>
        Повторить
      </button>
    </div>
  ),
}));

vi.mock('@/components/RoomDetailCard', () => ({
  default: ({ room }: any) => (
    <div data-testid="room-detail-card">
      <h2>{room.name}</h2>
    </div>
  ),
}));

vi.mock('@/components/RoomSchedule', () => ({
  RoomSchedule: ({ onDateChange, onBookClick, isLoading }: any) => (
    <div data-testid="room-schedule">
      {isLoading && <span data-testid="schedule-loading">Загрузка расписания...</span>}
      <button
        type="button"
        data-testid="change-date-btn"
        onClick={() => onDateChange(new Date('2026-10-20'))}
      >
        Изменить дату
      </button>
      <button type="button" data-testid="book-trigger-btn" onClick={onBookClick}>
        Забронировать
      </button>
    </div>
  ),
}));

vi.mock('@/components/CreateBookingModal', () => ({
  CreateBookingModal: ({ onClose }: any) => (
    <div data-testid="create-booking-modal">
      <span>Модалка бронирования</span>
      <button type="button" data-testid="close-modal-btn" onClick={onClose}>
        Закрыть
      </button>
    </div>
  ),
}));

describe('RoomDetailsPage', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'Эверест',
    capacity: 10,
    office: { id: 'office-1', name: 'Главный офис' },
  };

  const mockUser = {
    id: 'user-1',
    name: 'Иван Иванов',
  };

  const mockRefetchRoom = vi.fn();
  const mockRefetchBookings = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Мок текущего пользователя по умолчанию
    (useQuery as any).mockReturnValue({
      data: mockUser,
    });

    // Мок хука детализации комнаты по умолчанию
    vi.spyOn(useRoomDetailsModule, 'useRoomDetails').mockReturnValue({
      data: mockRoom,
      isLoading: false,
      isError: false,
      refetch: mockRefetchRoom,
    } as any);

    // Мок хука бронирований по умолчанию
    vi.spyOn(useRoomBookingsModule, 'useRoomBookings').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: mockRefetchBookings,
    } as any);
  });

  it('отображает скелетон во время загрузки информации о комнате', () => {
    vi.spyOn(useRoomDetailsModule, 'useRoomDetails').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: mockRefetchRoom,
    } as any);

    render(<RoomDetailsPage />);

    expect(screen.getByTestId('room-detail-skeleton')).toBeTruthy();
  });

  it('отображает состояние ошибки при сбое загрузки комнаты и позволяет повторить запрос', () => {
    vi.spyOn(useRoomDetailsModule, 'useRoomDetails').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetchRoom,
    } as any);

    render(<RoomDetailsPage />);

    expect(screen.getByTestId('error-state')).toBeTruthy();
    expect(screen.getByText('Не удалось загрузить данные о комнате')).toBeTruthy();

    fireEvent.click(screen.getByTestId('retry-btn'));
    expect(mockRefetchRoom).toHaveBeenCalledTimes(1);
  });

  it('успешно рендерит карточку комнаты, хлебные крошки и расписание', () => {
    render(<RoomDetailsPage />);

    expect(screen.getByTestId('room-detail-card')).toBeTruthy();
    expect(screen.getByTestId('room-schedule')).toBeTruthy();
    expect(screen.getByText('Комната Эверест')).toBeTruthy();
    expect(screen.getByText('Главный офис')).toBeTruthy();
  });

  it('переходит на главную страницу при клике на хлебные крошки', () => {
    render(<RoomDetailsPage />);

    fireEvent.click(screen.getAllByText('Переговорные')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getAllByText('Главный офис')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('открывает и закрывает модальное окно бронирования', () => {
    render(<RoomDetailsPage />);

    // Модалка закрыта по умолчанию
    expect(screen.queryByTestId('create-booking-modal')).toBeNull();

    // Кликаем по кнопке бронирования в расписании
    fireEvent.click(screen.getAllByTestId('book-trigger-btn')[0]);
    expect(screen.getByTestId('create-booking-modal')).toBeTruthy();

    // Закрываем модалку
    fireEvent.click(screen.getByTestId('close-modal-btn'));
    expect(screen.queryByTestId('create-booking-modal')).toBeNull();
  });

  it('обновляет выбранную дату при взаимодействии с расписанием', () => {
    const mockUseRoomBookings = vi.spyOn(useRoomBookingsModule, 'useRoomBookings');

    render(<RoomDetailsPage />);

    const newDate = new Date('2026-10-20');
    const expectedStartOfDay = new Date(newDate);
    expectedStartOfDay.setHours(0, 0, 0, 0);

    fireEvent.click(screen.getAllByTestId('change-date-btn')[0]);

    // Проверяем, что useRoomBookings вызван с корректным ISO-значением начала дня
    expect(mockUseRoomBookings).toHaveBeenLastCalledWith(
      expect.objectContaining({
        roomId: 'room-1',
        from: expectedStartOfDay.toISOString(),
      })
    );
  });
});