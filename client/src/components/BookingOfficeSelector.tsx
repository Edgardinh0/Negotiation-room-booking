import { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import type { Office } from '@/types/api';
import { useOffices } from '@/hooks/useOffices';
import '@/styles/bookingofficeselector.css';

interface OfficeSelectProps {
  selectedOfficeId: string;
  onSelect: (officeId: string) => void;
}

export function BookingOfficeSelector({ selectedOfficeId, onSelect }: OfficeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: offices = [] } = useOffices()

  const selectedOffice = offices.find((o) => o.id === selectedOfficeId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="booking-office-select-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`booking-office-select-trigger ${selectedOfficeId === 'all' ? 'placeholder' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOfficeId === 'all' ? 'Все офисы' : selectedOffice?.name}</span>
        <IoChevronDown className={`booking-office-select-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="booking-office-select-options">
          <li
            className={`booking-office-option-item ${selectedOfficeId === 'all' ? 'active' : ''}`}
            onClick={() => handleSelect('all')}
          >
            Все офисы
          </li>
          {offices.map((office) => (
            <li
              key={office.id}
              className={`booking-office-option-item ${selectedOfficeId === office.id ? 'active' : ''}`}
              onClick={() => handleSelect(office.id)}
            >
              {office.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}