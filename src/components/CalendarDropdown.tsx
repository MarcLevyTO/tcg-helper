'use client';

import { Event } from '@/src/types';
import { generateCalendarLinks } from '@/src/utils/utils';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './CalendarDropdown.scss';

const CalendarDropdown = ({ event }: { event: Event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const links = generateCalendarLinks(event);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8, // 8px above button (mb-2)
        left: rect.right, // align to right edge of button
      });
    }
  }, [isOpen]);

  const calendarOptions = [
    { name: 'Google Calendar', url: links.google },
    { name: 'Outlook', url: links.outlook },
    { name: 'Office 365', url: links.office365 },
    { name: 'Yahoo Calendar', url: links.yahoo },
    { name: 'Apple Calendar (ICS)', url: links.ics, download: true },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="calendar-dropdown-button"
        title="Add to Calendar"
      >
        📅
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="calendar-dropdown-menu"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-100%, -100%)',
          }}
        >
          <div className="dropdown-inner">
            {calendarOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                {...(option.download ? { download: `${event.name}.ics` } : { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={() => setIsOpen(false)}
                className="calendar-dropdown-item"
              >
                <span>{option.name}</span>
              </a>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CalendarDropdown;
