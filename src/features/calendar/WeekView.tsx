// src/features/calendar/WeekView.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useLiveCalendarEvents } from '@/db/calendarService';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, format } from 'date-fns';
import type { CalendarEvent } from '@/types/db.types';
import { EventForm } from './EventForm';

export const WeekView: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const events = useLiveCalendarEvents();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const eventsInDay = (date: Date): CalendarEvent[] =>
    events?.filter((e) => {
      const start = new Date(e.start);
      return format(start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }) ?? [];

  const prevWeek = () => setCurrentWeek((d) => subWeeks(d, 1));
  const nextWeek = () => setCurrentWeek((d) => addWeeks(d, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={prevWeek}>
          Prev
        </Button>
        <h2 className="text-xl font-semibold">
          Week of {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d')}
        </h2>
        <Button variant="secondary" size="sm" leftIcon={<ChevronRight className="w-4 h-4" />} onClick={nextWeek}>
          Next
        </Button>
      </div>

      <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
        Add Event
      </Button>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = eventsInDay(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          return (
            <Card
              key={format(day, 'yyyy-MM-dd')}
              title={format(day, 'EEE d')}
              className={`p-2 ${isToday ? 'border-twilight-400 bg-twilight-600/25' : ''}`}
            >
              {dayEvents.map((e) => (
                <div key={e.id} className="text-xs truncate" title={e.title}>
                  • {e.title}
                </div>
              ))}
            </Card>
          );
        })}
      </div>

      {showForm && <EventForm onClose={() => setShowForm(false)} defaultStart={new Date()} />}
    </div>
  );
};
