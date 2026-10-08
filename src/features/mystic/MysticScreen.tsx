import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';

const SAMPLE_CARDS = [
  {
    name: 'The Star',
    arcana: 'Major Arcana XVII',
    keywords: ['Hope', 'Inspiration', 'Serenity', 'Celestial Guidance'],
    meaning:
      'A beacon of renewed hope and cosmic alignment. When The Star appears, your inner sanctuary is illuminated by quiet certainty.',
    prompt: 'What starlight dream are you ready to nurture this lunar cycle?',
    image: '/images/Tarot 1.jpeg',
  },
  {
    name: 'The High Priestess',
    arcana: 'Major Arcana II',
    keywords: ['Intuition', 'Sacred Knowledge', 'Divine Feminine', 'Subconscious'],
    meaning:
      'Trust the silent wisdom that lives beneath thoughts. Luna sits beside the veil of mysteries, inviting you to listen inward.',
    prompt: 'What truth is your intuition whispering that logic has ignored?',
    image: '/images/Tarot 2.jpeg',
  },
  {
    name: 'The Empress',
    arcana: 'Major Arcana III',
    keywords: ['Abundance', 'Fertility', 'Sensory Comfort', 'Nurturance'],
    meaning:
      'Creation flourishes through warmth and patient care. Pour love into your daily rituals and watch ideas bloom gracefully.',
    prompt: 'In what area of your life can you be more gentle with yourself today?',
    image: '/images/Tarot 3.jpeg',
  },
];

export const MysticScreen: React.FC = () => {
  const [cardIndex, setCardIndex] = useState(0);

  const activeCard = SAMPLE_CARDS[cardIndex];

  const handleDrawAnother = () => {
    setCardIndex((prev) => (prev + 1) % SAMPLE_CARDS.length);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-twilight-500/15">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Mystic Sanctuary & Tarot
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daily celestial archetypes, lunar ephemeris interpretations, and private reflections.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDrawAnother}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Draw Again
        </Button>
      </div>

      <Alert type="info" title="Phase 1 Mystic Deck Foundation">
        Featuring offline celestial tarot assets and mathematical ephemeris calculations. 3D card flips and multi-card spreads will be unlocked in Phase 6 & 7.
      </Alert>

      {/* Daily Tarot Card Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Card Artwork Display */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-60 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-starlight-400/40 shadow-glow-gold bg-midnight-950 p-2">
            <img
              src={activeCard.image}
              alt={activeCard.name}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                // Fallback styling if local image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent flex items-end p-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-starlight-300 block">
                  {activeCard.arcana}
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {activeCard.name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Card Interpretation & Journal Prompt */}
        <div className="md:col-span-7 space-y-4">
          <Card
            title={activeCard.name}
            subtitle={activeCard.arcana}
            icon={<Sparkles className="w-4 h-4" />}
            headerAction={
              <span className="text-xs px-2.5 py-1 rounded-full bg-starlight-500/20 text-starlight-300 font-semibold border border-starlight-500/30">
                Upright
              </span>
            }
          >
            <div className="space-y-4 py-1">
              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5">
                {activeCard.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2.5 py-1 rounded-lg bg-twilight-600/20 text-twilight-300 border border-twilight-500/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Meaning */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Archetype Interpretation
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {activeCard.meaning}
                </p>
              </div>

              {/* Reflective Journal Prompt */}
              <div className="p-3.5 rounded-xl bg-twilight-600/15 border border-twilight-500/25">
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen className="w-4 h-4 text-twilight-300" />
                  <span className="text-xs font-bold text-twilight-300 uppercase tracking-wider">
                    Daily Reflection Prompt
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic">
                  "{activeCard.prompt}"
                </p>
              </div>
            </div>
          </Card>

          {/* Ephemeris Summary Widget */}
          <Card
            title="Current Astronomical Ephemeris"
            subtitle="Calculated offline via Astronomy Engine"
            icon={<Compass className="w-4 h-4" />}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center py-1">
              <div className="p-2.5 rounded-xl bg-midnight-900/50 border border-twilight-500/15">
                <span className="text-[11px] text-slate-400 block mb-0.5">Moon Phase</span>
                <span className="text-xs sm:text-sm font-bold text-slate-100">
                  Waxing Crescent
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-midnight-900/50 border border-twilight-500/15">
                <span className="text-[11px] text-slate-400 block mb-0.5">Illumination</span>
                <span className="text-xs sm:text-sm font-bold text-starlight-300">
                  18.4%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-midnight-900/50 border border-twilight-500/15">
                <span className="text-[11px] text-slate-400 block mb-0.5">Zodiac Sign</span>
                <span className="text-xs sm:text-sm font-bold text-twilight-300">
                  Taurus ♉
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-midnight-900/50 border border-twilight-500/15">
                <span className="text-[11px] text-slate-400 block mb-0.5">Void-of-Course</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  Active in 14h
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
