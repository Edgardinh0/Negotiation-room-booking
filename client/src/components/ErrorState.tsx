import { LuTriangle } from 'react-icons/lu';
import '@/styles/errorstate.css';

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="error-state-container">
      <div className="error-icon-circle">
        <LuTriangle className="error-icon" />
      </div>
      <h3 className="error-title">Не удалось загрузить данные</h3>
      <p className="error-subtitle">
        Произошла ошибка при загрузке списка переговорных
      </p>
      <button type="button" className="btn-retry" onClick={onRetry}>
        Попробовать снова
      </button>
    </div>
  );
}