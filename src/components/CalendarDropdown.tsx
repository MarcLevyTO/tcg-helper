'use client';

import { Event } from '@/src/types';
import { generateCalendarLinks } from '@/src/shared/utils';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
        className="py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20 cursor-pointer"
        title="Add to Calendar"
      >
        📅
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed min-w-max bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-100%, -100%)',
          }}
        >
          <div className="py-1">
            {calendarOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                {...(option.download ? { download: `${event.name}.ics` } : { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors whitespace-nowrap"
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
