import { useState, useRef, useEffect } from 'react';
import { LuCalendar, LuChevronDown } from 'react-icons/lu';
import '@/styles/datedropdown.css';

export type TimeRange = 'all' | 'today' | 'week' | 'month';

interface DateRangeDropdownProps {
  selectedRange: TimeRange;
  onSelectRange: (range: TimeRange) => void;
}

const RANGE_LABELS: Record<TimeRange, string> = {
  all: 'За все время',
  today: 'Сегодня',
  week: 'На этой неделе',
  month: 'В этом месяце',
};

export function DateRangeDropdown({ selectedRange, onSelectRange }: DateRangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="booking-date-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="booking-date-btn-time-filter"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <LuCalendar className="booking-date-filter-icon" />
        <span>{RANGE_LABELS[selectedRange]}</span>
        <LuChevronDown className={`booking-date-chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="booking-date-select-options">
          {(Object.keys(RANGE_LABELS) as TimeRange[]).map((rangeKey) => (
            <li
              key={rangeKey}
              className={`booking-date-option-item ${selectedRange === rangeKey ? 'active' : ''}`}
              onClick={() => {
                onSelectRange(rangeKey);
                setIsOpen(false);
              }}
            >
              {RANGE_LABELS[rangeKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}