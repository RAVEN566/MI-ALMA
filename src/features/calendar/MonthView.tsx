// src/features/calendar/MonthView.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useLiveCalendarEvents } from '@/db/calendarService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import type { CalendarEvent } from '@/types/db.types';
import { EventForm } from './EventForm';

export const MonthView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const events = useLiveCalendarEvents();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventsInMonth = (date: Date): CalendarEvent[] =>
    events?.filter((e) => {
      const start = new Date(e.start);
      return start >= monthStart && start <= monthEnd && format(start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }) ?? [];

  const prevMonth = () => setCurrentMonth((d) => subMonths(d, 1));
  const nextMonth = () => setCurrentMonth((d) => addMonths(d, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={prevMonth}>
          Prev
        </Button>
        <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <Button variant="secondary" size="sm" leftIcon={<ChevronRight className="w-4 h-4" />} onClick={nextMonth}>
          Next
        </Button>
      </div>

      <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
        Add Event
      </Button>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(monthStart.getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="h-20" />
        ))}
        {days.map((day) => {
          const dayEvents = eventsInMonth(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          return (
            <Card
              key={format(day, 'yyyy-MM-dd')}
              title={format(day, 'd')}
              className={`h-20 p-2 ${isToday ? 'border-twilight-400 bg-twilight-600/25' : ''}`} 
            >
              {dayEvents.slice(0, 2).map((e) => (
                <div key={e.id} className="text-xs truncate" title={e.title}>
                  • {e.title}
                </div>
              ))}
              {dayEvents.length > 2 && <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>}
            </Card>
          );
        })}
      </div>

      {showForm && <EventForm onClose={() => setShowForm(false)} defaultStart={new Date()} />}
    </div>
  );
};
