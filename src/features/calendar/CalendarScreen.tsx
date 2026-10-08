// src/features/calendar/CalendarScreen.tsx
import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

export const CalendarScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="space-y-6 p-4 animate-in fade-in duration-300">
      {/* Header with view selector */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Celestial Calendar & Schedule</h2>
        <div className="flex gap-2">
          <Button variant={viewMode === 'month' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('month')}>
            Month
          </Button>
          <Button variant={viewMode === 'week' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('week')}>
            Week
          </Button>
          <Button variant={viewMode === 'day' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('day')}>
            Day
          </Button>
        </div>
      </div>

      {/* Informational alert – can be removed once data is live */}
      {viewMode === 'month' && (
        <Alert type="info" title="Phase 1 Calendar Foundation">
          Interactive month grid with lunar ephemeris ribbon integration. Detailed time‑blocking and sync will be expanded in Phase 2.
        </Alert>
      )}

      {/* Render the selected view */}
      {viewMode === 'month' && <MonthView />}
      {viewMode === 'week' && <WeekView />}
      {viewMode === 'day' && <DayView />}
    </div>
  );
};
