import { useState, useRef, useEffect } from 'react';
import '@/styles/officeselector.css';
import { IoChevronDown } from 'react-icons/io5';
import type { Office } from '@/types/api';


const OFFICES: Office[] = [
  { id: '1', name: 'Офис 1', address: 'ул. Ленина, 10', timezone: '14:30' },
  { id: '2', name: 'Офис 2', address: 'пр. Мира, 42', timezone: '15:30' },
  { id: '3', name: 'Офис 3', address: 'наб. Реки, 5', timezone: '12:30' },
];

interface OfficeSelectorProps {
  selectedOfficeId: string;
  onSelectOffice: (id: string) => void;
}

function OfficeSelector({selectedOfficeId, onSelectOffice}: OfficeSelectorProps) {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOffice = OFFICES.find((o) => o.id === selectedOfficeId);

  // Закрытие при клике снаружи элемента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onSelectOffice(id);
    setIsOpen(false);
  };

  return (
    <div className="office-selector" ref={dropdownRef}>
      <div className="office-info">
        <div className="select-wrapper">
          <button
            type="button"
            className={`custom-select-trigger ${!selectedOffice ? 'placeholder' : ''}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {selectedOffice ? selectedOffice.name : 'Выберите офис'}
            <IoChevronDown className={`office-select-icon ${isOpen ? 'open' : ''}`} />
          </button>

          {isOpen && (
            <ul className="custom-select-options">
              {OFFICES.map((office) => (
                <li
                  key={office.id}
                  className={`option-item ${selectedOfficeId === office.id ? 'active' : ''}`}
                  onClick={() => handleSelect(office.id)}
                >
                  {office.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="office-meta">
        {selectedOffice ? (
          <span style={{color: 'var(--text)'}}>{selectedOffice.address} • Местное время: {selectedOffice.timezone}</span>
        ) : (
          <span>Адрес не выбран • Местное время: --</span>
        )}
      </div>
    </div>
  );
}

export default OfficeSelector;