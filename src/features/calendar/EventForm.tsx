// src/features/calendar/EventForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Dialog } from '@/components/common/Dialog';
import { addCalendarEvent } from '@/db/calendarService';
import type { CalendarEvent } from '@/types/db.types';
import { formatISO } from 'date-fns';

interface EventFormProps {
  /** Called when the form should be closed (e.g., cancel or after submit) */
  onClose: () => void;
  /** The default start date/time for a new event */
  defaultStart: Date;
  /** Optional existing event for edit mode – not used yet but kept for future extensibility */
  editEvent?: CalendarEvent;
}

export const EventForm: React.FC<EventFormProps> = ({ onClose, defaultStart, editEvent }) => {
  const isEdit = !!editEvent;
  const [title, setTitle] = useState(editEvent?.title ?? '');
  const [description, setDescription] = useState(editEvent?.description ?? '');
  const [allDay, setAllDay] = useState(editEvent?.allDay ?? false);
  const [start, setStart] = useState(editEvent?.start ?? formatISO(defaultStart, { representation: 'date' }));
  const [end, setEnd] = useState(editEvent?.end ?? formatISO(defaultStart, { representation: 'date' }));
  const [category, setCategory] = useState(editEvent?.category ?? 'appointment');
  const [reminders, setReminders] = useState<string>(
    editEvent?.reminders?.join(', ') ?? ''
  );
  const [taskId, setTaskId] = useState(editEvent?.taskId ?? '');
  const [colorToken, setColorToken] = useState(editEvent?.colorToken ?? '#7f5af0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reminderArray = reminders
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
      .map(Number);

    const payload: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description: description || undefined,
      allDay,
      start,
      end,
      category: category as CalendarEvent['category'],
      reminders: reminderArray,
      taskId: taskId || undefined,
      colorToken,
      lunarPhaseTag: undefined,
    };

    if (isEdit && editEvent) {
      // Update flow – currently not used in UI but kept for completeness
      await import('@/db/calendarService').then((mod) =>
        mod.updateCalendarEvent(editEvent.id, payload)
      );
    } else {
      await addCalendarEvent(payload);
    }
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} title={isEdit ? 'Edit Event' : 'Add Event'}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Category dropdown using native select */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-200">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded bg-gray-800 text-gray-100 p-2"
          >
            <option value="focus_block">Focus Block</option>
            <option value="ritual">Ritual</option>
            <option value="appointment">Appointment</option>
            <option value="routine">Routine</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={allDay}
              onChange={() => setAllDay(!allDay)}
            />
            <span>All‑day</span>
          </label>
        </div>
        <Input
          type="datetime-local"
          label="Start"
          value={formatISO(new Date(start), { representation: 'date' })}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <Input
          type="datetime-local"
          label="End"
          value={formatISO(new Date(end), { representation: 'date' })}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <Input
          label="Reminders (minutes, comma‑separated)"
          value={reminders}
          onChange={(e) => setReminders(e.target.value)}
          placeholder="5,10"
        />
        <Input
          label="Linked Task ID (optional)"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        />
        <Input
          label="Event colour (hex)"
          type="color"
          value={colorToken}
          onChange={(e) => setColorToken(e.target.value)}
        />
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
