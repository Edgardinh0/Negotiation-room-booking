import { LuTriangle } from 'react-icons/lu';
import '@/styles/errorstate.css';

interface ErrorStateProps {
  onRetry?: () => void;
  title: string,
  description: string
}

export function ErrorState({ onRetry, title, description }: ErrorStateProps) {
  return (
    <div className="error-state-container">
      <div className="error-icon-circle">
        <LuTriangle className="error-icon" />
      </div>
      <h3 className="error-title">{title}</h3>
      <p className="error-subtitle">
        {description}
      </p>
      <button type="button" className="btn-retry" onClick={onRetry}>
        Попробовать снова
      </button>
    </div>
  );
}