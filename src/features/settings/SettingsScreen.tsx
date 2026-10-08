import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Cat,
  Moon,
  Sun,
  ShieldCheck,
  Download,
  Upload,
  BellOff,
  Check,
} from 'lucide-react';
import { db } from '@/db/database';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const SettingsScreen: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const cat = useLiveQuery(() => db.catProfile.get('primary_cat'));
  const settings = useLiveQuery(() => db.appSettings.get('user_settings'));

  if (!cat || !settings) {
    return <LoadingSpinner label="Loading settings sanctuary..." />;
  }

  const handleUpdateCatName = async (newName: string) => {
    if (!newName.trim()) return;
    await db.catProfile.update('primary_cat', { name: newName.trim() });
    setSaveMessage('Companion profile updated successfully.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleToggleQuietHours = async () => {
    const updated = !settings.quietHoursEnabled;
    await db.appSettings.update('user_settings', { quietHoursEnabled: updated });
    setSaveMessage(`Quiet hours ${updated ? 'enabled' : 'disabled'}.`);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleExportBackup = async () => {
    const allTasks = await db.tasks.toArray();
    const allSettings = await db.appSettings.toArray();
    const catProfile = await db.catProfile.get('primary_cat');

    const backupData = {
      app: 'MoonPaw',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks: allTasks,
      cat: catProfile,
      settings: allSettings,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moonpaw-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setSaveMessage('Client-side backup exported safely to your device.');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-twilight-500/15">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Cat Sanctuary & Preferences
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Personalize Luna, adjust celestial themes, and manage your private data.
          </p>
        </div>
      </div>

      {saveMessage && (
        <Alert type="success" title="Settings Saved" onDismiss={() => setSaveMessage(null)}>
          {saveMessage}
        </Alert>
      )}

      {/* Zero-Cloud Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 text-emerald-100 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <h4 className="font-bold text-emerald-300 mb-0.5">
            Zero-Cloud Privacy Guarantee
          </h4>
          <p className="text-slate-300 leading-relaxed">
            All your tasks, reflections, habits, and cat progress are saved 100% locally in your device's IndexedDB. No accounts, no trackers, and no remote servers.
          </p>
        </div>
      </div>

      {/* Companion Customization Card */}
      <Card
        title="Companion Customization"
        subtitle="Manage your celestial cat companion"
        icon={<Cat className="w-4 h-4" />}
      >
        <div className="space-y-4 py-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-twilight-500/30 bg-midnight-900 shadow-glow-sm">
              <img
                src="/images/Fav1.jpeg"
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">{cat.name}</h3>
              <p className="text-xs text-slate-400">
                Level {cat.level} Celestial Shorthair • {cat.stardust} Stardust
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <Input
              label="Companion Name"
              defaultValue={cat.name}
              onBlur={(e) => handleUpdateCatName(e.target.value)}
              helperText="Press tab or click outside to save."
            />
          </div>
        </div>
      </Card>

      {/* Theme & Display Preferences */}
      <Card
        title="Celestial Appearance"
        subtitle="Choose your preferred cosmic aesthetic"
        icon={<Moon className="w-4 h-4" />}
      >
        <div className="grid grid-cols-2 gap-3 py-1 max-w-md">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all min-h-[48px] ${
              theme === 'dark'
                ? 'border-twilight-400 bg-twilight-600/20 shadow-glow-sm font-bold text-white'
                : 'border-twilight-500/20 bg-midnight-900/40 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-twilight-400" />
              <span className="text-xs sm:text-sm">Midnight Dark</span>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-twilight-400" />}
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all min-h-[48px] ${
              theme === 'light'
                ? 'border-twilight-400 bg-twilight-600/20 shadow-glow-sm font-bold text-slate-900 dark:text-white'
                : 'border-twilight-500/20 bg-midnight-900/40 text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-starlight-400" />
              <span className="text-xs sm:text-sm">Starlight Light</span>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-twilight-400" />}
          </button>
        </div>
      </Card>

      {/* Sound & Quiet Hours Settings */}
      <Card
        title="Rituals & Quiet Hours"
        subtitle="Control sound chimes and nighttime tranquility"
        icon={<BellOff className="w-4 h-4" />}
      >
        <div className="space-y-4 py-1">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-midnight-900/40 border border-twilight-500/15">
            <div>
              <h4 className="text-sm font-bold text-slate-100">Quiet Hours</h4>
              <p className="text-xs text-slate-400">
                Silences all audio notifications between 10:00 PM and 8:00 AM.
              </p>
            </div>
            <Button
              variant={settings.quietHoursEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleToggleQuietHours}
            >
              {settings.quietHoursEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Backup & Restore */}
      <Card
        title="Encrypted Local Backup"
        subtitle="Export or restore your private sanctuary data"
        icon={<Download className="w-4 h-4" />}
      >
        <div className="space-y-3 py-1">
          <p className="text-xs sm:text-sm text-slate-400">
            Export a full copy of your database. In Phase 9, this backup will include password-derived AES-256-GCM encryption.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="secondary"
              size="md"
              onClick={handleExportBackup}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Local Backup
            </Button>
            <Button
              variant="ghost"
              size="md"
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => alert('Backup import will be available in Phase 9.')}
            >
              Restore from File
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
