import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Sparkles,
  CheckSquare,
  CalendarDays,
  Flame,
  Sun,
  Moon,
  Cat,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { CosmicBackground } from './CosmicBackground';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Sparkles className="w-5 h-5" /> },
  { path: '/tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
  { path: '/calendar', label: 'Calendar', icon: <CalendarDays className="w-5 h-5" /> },
  { path: '/mystic', label: 'Mystic', icon: <Flame className="w-5 h-5" /> },
  { path: '/settings', label: 'Cat & Settings', icon: <Cat className="w-5 h-5" /> },
];

export const AppLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col md:flex-row text-slate-800 dark:text-slate-100 overflow-x-hidden selection:bg-twilight-600 selection:text-white">
      <CosmicBackground />

      {/* Tablet & Desktop Sidebar Navigation (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-twilight-500/15 glass-panel h-screen sticky top-0 p-5 z-30 justify-between select-none">
        <div>
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-twilight-600 to-starlight-400 p-0.5 shadow-glow-sm flex items-center justify-center text-midnight-950 font-bold overflow-hidden">
              <img
                src="/images/Fav1.jpeg"
                alt="MoonPaw Logo"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-twilight-400 to-starlight-300 bg-clip-text text-transparent">
                MoonPaw
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                Celestial Sanctuary
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Desktop navigation">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-twilight-600/20 text-twilight-400 dark:text-twilight-300 font-semibold border border-twilight-500/30 shadow-glow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-twilight-500/10'
                  }`}
                >
                  <span className={isActive ? 'text-twilight-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Desktop Sidebar Footer: Theme Toggle & Status */}
        <div className="pt-4 border-t border-twilight-500/15 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-aurora-400 animate-pulse" />
            <span>Offline-Ready PWA</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass-card hover:bg-twilight-500/15 text-slate-600 dark:text-slate-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-starlight-400" />
            ) : (
              <Moon className="w-4 h-4 text-twilight-600" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-h-[100dvh] w-full max-w-full">
        {/* Mobile Top Header (Dynamic Island Safe Area Padding) */}
        <header className="sticky top-0 z-30 pt-safe px-4 pb-3 glass-panel md:hidden flex items-center justify-between border-b border-twilight-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-twilight-500/30">
              <img
                src="/images/Fav1.jpeg"
                alt="MoonPaw"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="font-bold text-base bg-gradient-to-r from-twilight-400 to-starlight-300 bg-clip-text text-transparent">
                MoonPaw
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-card text-slate-600 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 transition-transform"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-starlight-400" />
              ) : (
                <Moon className="w-4 h-4 text-twilight-600" />
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-5xl mx-auto w-full pb-28 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (Phone First, iPhone Safe-Area Padded) */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-twilight-500/20 pb-safe shadow-2xl"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around px-2 py-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-xl transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'text-twilight-400 dark:text-twilight-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-twilight-400 shadow-glow-sm" />
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-1 line-clamp-1">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
