// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoomsPage from '@/pages/RoomsPage';
import * as useOfficesModule from '@/hooks/useOffices';
import * as useRoomsModule from '@/hooks/useRooms';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/hooks/useOffices');
vi.mock('@/hooks/useRooms');

vi.mock('@/components/OfficeSelector', () => ({
  default: ({ onSelectOffice }: any) => (
    <div data-testid="office-selector">
      <button
        type="button"
        data-testid="test-select-office-btn"
        onClick={() => onSelectOffice('office-1')}
      >
        Выбрать офис
      </button>
    </div>
  ),
}));

vi.mock('@/components/RoomsFilters', () => ({
  default: ({ onFilterChange }: any) => (
    <div data-testid="rooms-filters">
      <button
        type="button"
        data-testid="test-apply-filters-btn"
        onClick={() =>
          onFilterChange({
            capacity: 8,
            date: new Date('2026-10-10'),
            startTime: '10:00',
            duration: 60,
            isValidTime: true,
          })
        }
      >
        Применить фильтр
      </button>
    </div>
  ),
}));

vi.mock('@/components/NoOfficeSelected', () => ({
  default: () => <div data-testid="no-office-selected">Офис не выбран</div>,
}));

vi.mock('@/components/ErrorState', () => ({
  ErrorState: ({ onRetry }: any) => (
    <div data-testid="error-state">
      <span>Ошибка загрузки</span>
      <button type="button" onClick={onRetry}>Повторить</button>
    </div>
  ),
}));

vi.mock('@/components/RoomSkeleton', () => ({
  default: () => <div data-testid="room-skeleton">Скелетон переговорной</div>,
}));

describe('RoomsPage', () => {
  const mockOffices = [
    { id: 'office-1', name: 'Главный офис', address: 'ул. Мира 1', timezone: 'UTC+3' },
  ];

  const selectOffice = () => {
    const buttons = screen.getAllByTestId('test-select-office-btn');
    fireEvent.click(buttons[0]);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useOfficesModule, 'useOffices').mockReturnValue({
      data: mockOffices,
      isLoading: false,
      isError: false,
    } as any);
  });

  it('отображает плашку "Офис не выбран" по умолчанию', () => {
    vi.spyOn(useRoomsModule, 'useRooms').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<RoomsPage />);

    expect(screen.getByTestId('no-office-selected')).toBeTruthy();
  });

  it('показывает состояние ошибки при сбое загрузки офисов или комнат', () => {
    vi.spyOn(useOfficesModule, 'useOffices').mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    } as any);

    vi.spyOn(useRoomsModule, 'useRooms').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<RoomsPage />);

    expect(screen.getByTestId('error-state')).toBeTruthy();
  });

  it('показывает скелетоны загрузки, когда выбран офис и идет запрос комнат', () => {
    vi.spyOn(useRoomsModule, 'useRooms').mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<RoomsPage />);

    selectOffice();

    expect(screen.getAllByTestId('room-skeleton')).toHaveLength(4);
  });

  it('передаёт параметры фильтрации в хук useRooms при их изменении', () => {
    const mockUseRooms = vi.spyOn(useRoomsModule, 'useRooms').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    render(<RoomsPage />);

    selectOffice();

    const applyButtons = screen.getAllByTestId('test-apply-filters-btn');
    fireEvent.click(applyButtons[0]);

    expect(mockUseRooms).toHaveBeenLastCalledWith(
      expect.objectContaining({
        officeId: 'office-1',
        minCapacity: 8,
      })
    );
  });
});0