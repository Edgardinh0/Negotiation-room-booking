import { useState, useRef, useEffect } from "react";
import DatePicker, { registerLocale } from 'react-datepicker'
import { LuClock } from "react-icons/lu";
import { IoChevronDown } from "react-icons/io5";
import { LuCalendar } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";
import '@/styles/roomfilters.css'
import 'react-datepicker/dist/react-datepicker.css'
import { ru } from "date-fns/locale/ru";

export interface FilterState {
        date: Date;
        startTime: String;
        duration: Number;
        capacity: Number;
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

registerLocale('ru', ru)

function RoomsFilters({isDisabled, onFilterChange}: BookingFiltersProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [startTime, setStartTime] = useState<string>('')
    const [duration, setDuration] = useState<number>(60)
    const [capacity, setCapacity] = useState<number>(4)

    //Состояние выпадающих окон
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [isDurationOpen, setIsDurationOpen] = useState(false)
    const [isCapacityOpen, setIsCapacityOpen] = useState(false)

    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 30)

    const containerRef = useRef<HTMLDivElement>(null)

    // Маска ввода времени (HH:MM)
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);

        if (value.length >= 3) {
        value = `${value.slice(0, 2)}:${value.slice(2)}`;
        }
        setStartTime(value);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsDatePickerOpen(false);
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
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="d MMMM, EE"
            locale="ru"
            minDate={today}
            maxDate={maxDate}
            disabled={isDisabled}
            placeholderText="Выберите дату"
            className="custom-datepicker-input"
          />
        </div>

        {isDatePickerOpen && (
          <div className="dropdown-popover date-picker-popover">
            <div className="calendar-placeholder-header">
              <strong>Октябрь 2024</strong>
            </div>
            <div className="filter-hint">Ограничение: не более 30 дней вперёд. Даты за пределами лимита неактивны.</div>
          </div>
        )}
      </div>

      {/* 2. ВРЕМЯ НАЧАЛА */}
      <div className="filter-item">
        <label className="filter-label">ВРЕМЯ НАЧАЛА</label>
        <div className="filter-trigger input-trigger">
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
            setIsDatePickerOpen(false);
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
                onClick={() => {
                  setDuration(opt.value);
                  setIsDurationOpen(false);
                }}
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
            setIsDatePickerOpen(false);
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
                onClick={() => {
                  setCapacity(cap);
                  setIsCapacityOpen(false);
                }}
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

export default RoomsFilters