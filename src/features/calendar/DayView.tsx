// src/features/calendar/DayView.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { Input } from '@/components/common/Input';
import { useLiveCalendarEvents, addCalendarEvent } from '@/db/calendarService';
import { format, startOfDay, addHours, eachHourOfInterval, isSameDay, parseISO } from 'date-fns';
import type { CalendarEvent } from '@/types/db.types';
import { EventForm } from './EventForm';

export const DayView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const events = useLiveCalendarEvents();

  const dayStart = startOfDay(currentDate);
  const dayEnd = addHours(dayStart, 24);
  const hours = eachHourOfInterval({ start: dayStart, end: dayEnd });

  const eventsInDay = (date: Date): CalendarEvent[] =>
    events?.filter((e) => isSameDay(parseISO(e.start), date)) ?? [];

  const prevDay = () => setCurrentDate((d) => addHours(d, -24));
  const nextDay = () => setCurrentDate((d) => addHours(d, 24));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={prevDay}>
          Prev
        </Button>
        <h2 className="text-xl font-semibold">{format(currentDate, 'EEEE, MMM d, yyyy')}</h2>
        <Button variant="secondary" size="sm" leftIcon={<ChevronRight className="w-4 h-4" />} onClick={nextDay}>
          Next
        </Button>
      </div>

      <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
        Add Event
      </Button>

      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 space-y-2">
          {hours.map((h) => (
            <div key={h.toISOString()} className="text-xs text-slate-400">
              {format(h, 'ha')}
            </div>
          ))}
        </div>
        <div className="col-span-3 space-y-2 border-l border-twilight-500/15 pl-2">
          {hours.map((h) => {
            const hourEvents = eventsInDay(currentDate).filter((e) => {
              const start = parseISO(e.start);
              return start.getHours() === h.getHours();
            });
            return (
              <div key={h.toISOString()} className="relative h-12 border-b border-twilight-500/10">
                {hourEvents.map((e) => (
                  <Card
                    key={e.id}
                    title={e.title}
                    className="absolute left-0 top-0 w-full h-full bg-twilight-600/30 border border-twilight-400 text-sm truncate"
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {showForm && <EventForm onClose={() => setShowForm(false)} defaultStart={currentDate} />}
    </div>
  );
};
