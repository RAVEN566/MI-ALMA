import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomeScreen } from '@/features/home/HomeScreen';
import { TasksScreen } from '@/features/tasks/TasksScreen';
import { CalendarScreen } from '@/features/calendar/CalendarScreen';
import { MysticScreen } from '@/features/mystic/MysticScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { initializeDatabaseSeed } from '@/db/seed';

export const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    initializeDatabaseSeed()
      .then(() => {
        if (isMounted) setIsInitialized(true);
      })
      .catch((err) => {
        console.error('Failed to initialize MoonPaw database seed:', err);
        if (isMounted) setInitError(err.message || 'Database initialization error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-midnight-950 text-white">
        <ErrorState
          title="Database Initialization Error"
          message={initError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-950">
        <LoadingSpinner label="Awakening the celestial sanctuary..." fullScreen />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/tasks" element={<TasksScreen />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            <Route path="/mystic" element={<MysticScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
