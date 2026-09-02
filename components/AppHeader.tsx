import React, { useState } from 'react';
import { Menu, Moon, Sun, Settings, Type, Highlighter, Clock } from 'lucide-react';
import type { Language } from '../types';
import { I18N } from '../src/i18n/strings';
import type { ReaderSettings } from '../src/features/reader/settings';
import CastleIcon from './CastleIcon';

interface Props {
  language: Language;
  theme: 'dark' | 'light';
  /** Desktop only: the sidebar is expanded, so the header logo steps aside. */
  sidebarExpanded: boolean;
  settings: ReaderSettings;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onOpenPrayerTimes: () => void;
  onToggleSetting: (key: keyof ReaderSettings) => void;
}

const AppHeader: React.FC<Props> = ({
  language,
  theme,
  sidebarExpanded,
  settings,
  onToggleSidebar,
  onToggleTheme,
  onOpenPrayerTimes,
  onToggleSetting,
}) => {
  const t = I18N[language];
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background z-50 relative">
      {/* Left: Menu Trigger */}
      <div className="flex items-center gap-3 z-10">
        <button
          onClick={onToggleSidebar}
          aria-label={t.menu}
          title={t.menu}
          className="p-2 -ml-2 text-foreground hover:bg-surface rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Centered Title */}
      <div className={`
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                text-center pointer-events-none md:pointer-events-auto
                transition-opacity duration-300
                ${sidebarExpanded ? 'lg:opacity-0' : 'lg:opacity-100'}
            `}>
        <div className="flex items-center justify-center text-foreground">
          <CastleIcon size={28} />
        </div>
      </div>

      {/* Right: Controls */}
      <div className="ml-auto flex items-center gap-2 z-10">
        <button
          onClick={onToggleTheme}
          aria-label={t.toggleTheme}
          title={t.toggleTheme}
          className="p-2 rounded-full text-neutral-500 hover:bg-surface hover:text-foreground transition-colors"
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button
          onClick={onOpenPrayerTimes}
          aria-label={t.prayerTimes}
          title={t.prayerTimes}
          className="p-2 rounded-full text-neutral-500 hover:bg-surface hover:text-foreground transition-colors"
        >
          <Clock size={20} />
        </button>

        {/* Settings Dropdown Wrapper */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label={t.settings}
            title={t.settings}
            aria-expanded={isSettingsOpen}
            className={`p-2 rounded-full transition-colors ${isSettingsOpen ? 'bg-surface text-foreground' : 'text-neutral-500 hover:bg-surface hover:text-foreground'}`}
          >
            <Settings size={20} />
          </button>

          {isSettingsOpen && (
            <>
              {/* Click-away layer. A button, so Escape-free keyboard users can
                  dismiss the menu with the same control screen readers announce. */}
              <button
                type="button"
                aria-label={t.close}
                onClick={() => setIsSettingsOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-background border border-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-1">
                  <SettingsToggle
                    icon={<Type size={16} className="shrink-0" />}
                    label={t.wordByWord}
                    checked={settings.showTranslation}
                    onToggle={() => onToggleSetting('showTranslation')}
                  />
                  <SettingsToggle
                    icon={<Highlighter size={16} className="shrink-0" />}
                    label={t.highlightWords}
                    checked={settings.enableHighlight}
                    onToggle={() => onToggleSetting('enableHighlight')}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

interface ToggleProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const SettingsToggle: React.FC<ToggleProps> = ({ icon, label, checked, onToggle }) => (
  <button
    onClick={onToggle}
    role="switch"
    aria-checked={checked}
    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm"
  >
    <span className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </span>
    <span className={`w-9 h-5 rounded-full relative transition-colors border ${checked ? 'bg-foreground border-foreground' : 'bg-surface border-neutral-300 dark:border-neutral-600'}`}>
      <span className={`absolute top-[1px] w-4 h-4 rounded-full transition-[left] duration-200 shadow-sm ${checked ? 'left-[17px] bg-background' : 'left-[1px] bg-foreground'}`} />
    </span>
  </button>
);

export default AppHeader;
