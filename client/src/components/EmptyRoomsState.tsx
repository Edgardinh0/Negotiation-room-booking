import { LuSearchX } from 'react-icons/lu';
import '@/styles/emptystate.css';

interface EmptyStateProps {
  onResetFilters?: () => void;
}

export function EmptyRoomsState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="empty-rooms-container">
      <div className="empty-icon-circle">
        <LuSearchX className="empty-icon" />
      </div>
      <h3 className="empty-title">Нет доступных переговорных</h3>
      <p className="empty-subtitle">
        Попробуйте изменить параметры фильтрации или выбрать другой офис
      </p>
      <button type="button" className="btn-reset" onClick={onResetFilters}>
        Сбросить фильтры
      </button>
    </div>
  );
}