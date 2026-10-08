import React, { useState } from 'react';
import { CatEngine } from '@/features/cat/CatEngine';

import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Moon,
  Heart,
  Fish,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { db } from '@/db/database';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Dialog } from '@/components/common/Dialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [petSuccess, setPetSuccess] = useState<string | null>(null);
  const [isFeedDialogOpen, setIsFeedDialogOpen] = useState(false);

  // Live queries from Dexie
  const cat = useLiveQuery(() => db.catProfile.get('primary_cat'));
  const pendingTasks = useLiveQuery(() =>
    db.tasks.where('status').equals('pending').toArray()
  );

  if (!cat) {
    return <LoadingSpinner label="Entering the celestial sanctuary..." fullScreen={false} />;
  }

  const handlePetCat = async () => {
    const updatedHappiness = Math.min(100, cat.happiness + 5);
    await db.catProfile.update('primary_cat', {
      happiness: updatedHappiness,
      lastPettedAt: new Date().toISOString(),
    });
    setPetSuccess('Luna purrs softly and leans affectionately against your hand! (+5 Happiness)');
    setTimeout(() => setPetSuccess(null), 4000);
  };

  const handleFeedCat = async () => {
    const updatedHunger = Math.min(100, cat.hunger + 15);
    const updatedStardust = Math.max(0, cat.stardust - 10);
    await db.catProfile.update('primary_cat', {
      hunger: updatedHunger,
      stardust: updatedStardust,
      lastFedAt: new Date().toISOString(),
    });
    setIsFeedDialogOpen(false);
    setPetSuccess('Luna happily munches on celestial tuna flakes! (+15 Hunger)');
    setTimeout(() => setPetSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Celestial Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-twilight-500/15">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-twilight-600/20 text-twilight-300 border border-twilight-500/30 mb-2">
            <Moon className="w-3.5 h-3.5 text-starlight-400" />
            Waxing Crescent • Moon in Taurus
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Good Evening, Starlight Traveler
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Your celestial sanctuary is peaceful. Luna is resting beside your grimoire.
          </p>
        </div>

        {/* Stardust Counter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-starlight-500/15 border border-starlight-500/30 text-starlight-400 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-starlight-400 animate-spin-slow" />
          <span>{cat.stardust} Stardust</span>
        </div>
      </div>

      {petSuccess && (
        <Alert type="success" title="Celestial Bond" onDismiss={() => setPetSuccess(null)}>
          {petSuccess}
        </Alert>
      )}

      {/* Primary Companion Stage Card */}
      <Card
        title={`${cat.name} the Companion`}
        subtitle={`Level ${cat.level} • ${cat.breed}`}
        icon={<Sparkles className="w-4 h-4" />}
        headerAction={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-twilight-600/20 text-twilight-300 border border-twilight-500/20 capitalize">
            {cat.currentMood}
          </span>
        }
      >
        <div className="flex flex-col md:flex-row items-center gap-6 py-2">
          {/* Virtual Cat Display Box */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border border-twilight-500/30 bg-gradient-to-b from-midnight-800 to-midnight-950 flex items-center justify-center p-3 shadow-glow-sm">
            {/* CatEngine renders its canvas */}
            <CatEngine />
          </div>

          {/* Cat Metrics & Interaction Buttons */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Hunger Metric */}
              <div className="glass-panel rounded-xl p-3 text-center border border-twilight-500/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  Hunger
                </span>
                <span className="font-bold text-base sm:text-lg text-emerald-400">
                  {cat.hunger}%
                </span>
                <div className="w-full bg-midnight-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.hunger}%` }}
                  />
                </div>
              </div>

              {/* Happiness Metric */}
              <div className="glass-panel rounded-xl p-3 text-center border border-twilight-500/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  Happiness
                </span>
                <span className="font-bold text-base sm:text-lg text-twilight-300">
                  {cat.happiness}%
                </span>
                <div className="w-full bg-midnight-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-twilight-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.happiness}%` }}
                  />
                </div>
              </div>

              {/* Energy Metric */}
              <div className="glass-panel rounded-xl p-3 text-center border border-twilight-500/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  Energy
                </span>
                <span className="font-bold text-base sm:text-lg text-starlight-400">
                  {cat.energy}%
                </span>
                <div className="w-full bg-midnight-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-starlight-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.energy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Quick Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={handlePetCat}
                leftIcon={<Heart className="w-4 h-4 text-rose-300" />}
              >
                Pet Luna
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsFeedDialogOpen(true)}
                leftIcon={<Fish className="w-4 h-4 text-astral-300" />}
              >
                Feed Treat
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/settings')}
              >
                Closet & Wardrobe
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Two-Column Grid: Quick Tasks & Quick Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Tasks Widget */}
        <Card
          title="Active Goals"
          subtitle={`${pendingTasks?.length || 0} pending to-dos`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tasks')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View All
            </Button>
          }
        >
          <div className="space-y-2.5">
            {pendingTasks && pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-midnight-900/40 dark:bg-midnight-900/60 border border-twilight-500/15"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <span className="text-[11px] text-twilight-300/80 capitalize">
                      {task.priority} Priority
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/tasks')}
                  >
                    Details
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">
                All celestial tasks are completed!
              </p>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/tasks')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create New Task
            </Button>
          </div>
        </Card>

        {/* Quick Focus Widget */}
        <Card
          title="Focus Sanctuary"
          subtitle="Pomodoro & Mindfulness"
          icon={<Clock className="w-4 h-4" />}
        >
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Link your focus sessions directly to real-world tasks. Luna studies beside you during every Pomodoro session.
            </p>
            <div className="p-3.5 rounded-xl bg-twilight-600/10 border border-twilight-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-twilight-300 block">
                  Recommended Interval
                </span>
                <span className="text-base font-bold text-starlight-300">
                  25 Min Deep Starlight
                </span>
              </div>
              <Button
                variant="starlight"
                size="sm"
                onClick={() => navigate('/tasks')}
              >
                Begin
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Earn +25 Stardust per completed block</span>
              <span className="text-aurora-400 font-medium">Wall-Clock Resilient</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Feed Treat Modal Dialog */}
      <Dialog
        isOpen={isFeedDialogOpen}
        onClose={() => setIsFeedDialogOpen(false)}
        title="Feed Luna"
        description="Share a nutritious celestial treat to replenish Luna's hunger."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setIsFeedDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleFeedCat}>
              Feed Tuna (Cost: 10 Stardust)
            </Button>
          </>
        }
      >
        <div className="space-y-3 py-1">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Feeding Luna restores hunger by 15 points and provides comfort. Current balance: <strong className="text-starlight-400">{cat.stardust} Stardust</strong>.
          </p>
        </div>
      </Dialog>
    </div>
  );
};
