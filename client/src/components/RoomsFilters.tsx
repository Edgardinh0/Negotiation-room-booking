import { useState, useRef, useEffect } from "react";
import DatePicker, { registerLocale } from 'react-datepicker';
import { LuClock, LuCalendar, LuUsers, LuCheck, LuLoaderCircle } from "react-icons/lu";
import { IoChevronDown } from "react-icons/io5";
import '@/styles/roomfilters.css';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from "date-fns/locale/ru";

export interface FilterState {
  date: Date | null;
  startTime: string;
  duration: number;
  capacity: number;
  isValidTime?: boolean;
}

interface BookingFiltersProps {
  isDisabled?: boolean;
  onFilterChange?: (filters: FilterState) => void;
}

const DURATION_OPTIONS = [
  { label: '15 мин', value: 15 },
  { label: '30 мин', value: 30 },
  { label: '45 мин', value: 45 },
  { label: '1 час', value: 60 },
  { label: '1 ч 15 мин', value: 75 },
  { label: '1 ч 30 мин', value: 90 },
  { label: '1 ч 45 мин', value: 105 },
  { label: '2 часа', value: 120 },
];

const CAPACITY_OPTIONS = [2, 4, 6, 8, 10, 12];
const MAX_END_HOUR = 20; // 20:00 - крайний срок окончания бронирования

registerLocale('ru', ru);

function RoomsFilters({ isDisabled, onFilterChange }: BookingFiltersProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [capacity, setCapacity] = useState<number>(4);
  const [timeError, setTimeError] = useState<string | null>(null);

  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const containerRef = useRef<HTMLDivElement>(null);

  // Валидация: бронирование должно завершиться до 20:00
  const validateTime = (timeStr: string, dur: number): boolean => {
    if (timeStr.length < 5) {
      setTimeError(null);
      return true;
    }

    const [hours, minutes] = timeStr.split(':').map(Number);
    const startInMinutes = hours * 60 + minutes;
    const endInMinutes = startInMinutes + dur;
    const maxInMinutes = MAX_END_HOUR * 60; // 20:00 -> 1200 минут

    if (hours >= 20 || endInMinutes > maxInMinutes) {
      setTimeError(`Бронирование доступно до ${MAX_END_HOUR}:00`);
      return false;
    }

    setTimeError(null);
    return true;
  };

  const updateFilters = (
    newDate: Date | null,
    newTime: string,
    newDuration: number,
    newCapacity: number
  ) => {
    const isValid = validateTime(newTime, newDuration);
    onFilterChange?.({
      date: newDate,
      startTime: newTime,
      duration: newDuration,
      capacity: newCapacity,
      isValidTime: isValid,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    updateFilters(date, startTime, duration, capacity);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}:${value.slice(2)}`;
    }

    setStartTime(value);
    updateFilters(selectedDate, value, duration, capacity);
  };

  const handleDurationSelect = (val: number) => {
    setDuration(val);
    setIsDurationOpen(false);
    updateFilters(selectedDate, startTime, val, capacity);
  };

  const handleCapacitySelect = (val: number) => {
    setCapacity(val);
    setIsCapacityOpen(false);
    updateFilters(selectedDate, startTime, duration, val);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDurationOpen(false);
        setIsCapacityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`booking-filters ${isDisabled ? 'disabled' : ''}`} ref={containerRef}>
      {/* 1. ДАТА */}
      <div className="filter-item">
        <label className="filter-label">ДАТА</label>
        <div className="filter-trigger date-picker-wrapper">
          <LuCalendar className="filter-icon" />
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="d MMMM, EE"
            locale="ru"
            minDate={today}
            maxDate={maxDate}
            disabled={isDisabled}
            placeholderText="Выберите дату"
            className="custom-datepicker-input"
          />
        </div>
      </div>

      {/* 2. ВРЕМЯ НАЧАЛА */}
      <div className="filter-item">
        <label className="filter-label">ВРЕМЯ НАЧАЛА</label>
        <div className={`filter-trigger input-trigger ${timeError ? 'input-error' : ''}`}>
          <LuClock className="filter-icon" />
          <input
            type="text"
            placeholder="--:--"
            value={startTime}
            onChange={handleTimeChange}
            disabled={isDisabled}
            maxLength={5}
            className="time-input"
          />
        </div>
        {timeError && (
          <div className="filter-error-text">
            <LuLoaderCircle /> {timeError}
          </div>
        )}
      </div>

      {/* 3. ДЛИТЕЛЬНОСТЬ */}
      <div className="filter-item">
        <label className="filter-label">ДЛИТЕЛЬНОСТЬ</label>
        <button
          type="button"
          disabled={isDisabled}
          className="filter-trigger"
          onClick={() => {
            setIsDurationOpen(!isDurationOpen);
            setIsCapacityOpen(false);
          }}
        >
          <span>{DURATION_OPTIONS.find((d) => d.value === duration)?.label}</span>
          <IoChevronDown className={`chevron-icon ${isDurationOpen ? 'open' : ''}`} />
        </button>

        {isDurationOpen && (
          <ul className="dropdown-popover options-list">
            {DURATION_OPTIONS.map((opt) => (
              <li
                key={opt.value}
                className={`option-row ${duration === opt.value ? 'selected' : ''}`}
                onClick={() => handleDurationSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {duration === opt.value && <LuCheck className="check-icon" />}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 4. ВМЕСТИМОСТЬ */}
      <div className="filter-item">
        <label className="filter-label">ВМЕСТИМОСТЬ</label>
        <button
          type="button"
          disabled={isDisabled}
          className="filter-trigger"
          onClick={() => {
            setIsCapacityOpen(!isCapacityOpen);
            setIsDurationOpen(false);
          }}
        >
          <LuUsers className="filter-icon" />
          <span>Мин. {capacity} чел.</span>
          <IoChevronDown className={`chevron-icon ${isCapacityOpen ? 'open' : ''}`} />
        </button>

        {isCapacityOpen && (
          <ul className="dropdown-popover options-list">
            {CAPACITY_OPTIONS.map((cap) => (
              <li
                key={cap}
                className={`option-row ${capacity === cap ? 'selected' : ''}`}
                onClick={() => handleCapacitySelect(cap)}
              >
                <span>{cap} чел.</span>
                {capacity === cap && <LuCheck className="check-icon" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RoomsFilters;