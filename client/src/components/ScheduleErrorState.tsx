import { LuTriangle } from "react-icons/lu";
import '@/styles/roomscheduleerror.css'

interface ScheduleErrorStateProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

export function ScheduleErrorState({
  onRetry,
  title = "Не удалось загрузить расписание",
  description = "Произошла ошибка при загрузке расписания переговорной",
}: ScheduleErrorStateProps) {
  return (
    <div className="schedule-error-card">
      <div className="schedule-error-icon-wrapper">
        <LuTriangle className="schedule-error-icon" />
      </div>

      <h3 className="schedule-error-title">{title}</h3>
      <p className="schedule-error-description">{description}</p>

      <button type="button" className="schedule-error-retry-btn" onClick={onRetry}>
        Попробовать снова
      </button>
    </div>
  );
}