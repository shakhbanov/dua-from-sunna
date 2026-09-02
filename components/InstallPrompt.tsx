import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';
import type { Language } from '../types';
import { I18N } from '../src/i18n/strings';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISS_KEY = 'hisn.installPromptDismissedAt';
// Snooze duration after user taps "Later" — 14 days in ms
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

interface Props {
  language: Language;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

function isMobileOrTablet(): boolean {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches === true;
  const narrowScreen = window.innerWidth <= 1024;
  return isIOS || isAndroid || (coarsePointer && narrowScreen);
}

function isIOSDevice(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isIOSSafari(): boolean {
  if (!isIOSDevice()) return false;
  const ua = navigator.userAgent;
  // Exclude Chrome, Firefox, Edge on iOS which can't install PWAs
  return !/CriOS|FxiOS|EdgiOS|OPT\/|YaBrowser/i.test(ua);
}

function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const when = parseInt(raw, 10);
    if (!Number.isFinite(when)) return false;
    return Date.now() - when < SNOOZE_MS;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

const InstallPrompt: React.FC<Props> = ({ language }) => {
  const t = I18N[language];
  const [visible, setVisible] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  // The captured banner event is replayed on install and never rendered, so a
  // ref keeps it without redrawing the component when it arrives.
  const deferredEvent = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (!isMobileOrTablet()) return;
    if (wasDismissedRecently()) return;

    // Android / Chrome: capture the native banner
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredEvent.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);

    // iOS Safari: no event — show manual instructions after a small delay
    if (isIOSSafari()) {
      const timer = setTimeout(() => {
        setIosMode(true);
        setVisible(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
      };
    }

    const onInstalled = () => {
      setVisible(false);
      deferredEvent.current = null;
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    const event = deferredEvent.current;
    if (!event) return;
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
        setVisible(false);
        deferredEvent.current = null;
        if (choice.outcome === 'dismissed') markDismissed();
      }
    } catch {
      setVisible(false);
    }
  }, []);

  const handleLater = () => {
    markDismissed();
    setVisible(false);
  };

  // Native <dialog>, opened non-modally: the sheet sits above the page without
  // trapping focus or blocking the reader behind it, and screen readers get the
  // dialog semantics from the element itself.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (visible && !dialog.open) dialog.show();
    if (!visible && dialog.open) dialog.close();
  }, [visible]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-x-0 bottom-0 top-auto z-[80] m-0 w-full max-w-none border-0 bg-transparent p-3 pb-[max(12px,env(safe-area-inset-bottom))] text-inherit pointer-events-none"
      aria-labelledby="install-prompt-title"
    >
      <div className="mx-auto max-w-md pointer-events-auto bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3 p-4">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center">
            <Download size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="install-prompt-title" className="text-sm font-semibold text-foreground leading-snug">
              {t.installPromptTitle}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {iosMode ? t.installPromptBodyIOS : t.installPromptBodyAndroid}
            </p>
          </div>
          <button
            onClick={handleLater}
            aria-label={t.close}
            className="p-1.5 -m-1.5 rounded-lg text-neutral-400 hover:bg-surface hover:text-foreground transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {iosMode ? (
          <div className="px-4 pb-4 space-y-2">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface">
              <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-sm text-foreground">{t.installIOSStep1}</span>
              <Share size={16} className="ml-auto text-neutral-500 shrink-0" />
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface">
              <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-sm text-foreground">{t.installIOSStep2}</span>
              <Plus size={16} className="ml-auto text-neutral-500 shrink-0" />
            </div>
            <button
              onClick={handleLater}
              className="w-full mt-2 py-2 rounded-xl border border-border text-sm text-neutral-600 dark:text-neutral-300 hover:bg-surface transition-colors"
            >
              {t.installPromptLater}
            </button>
          </div>
        ) : (
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={handleLater}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm text-neutral-600 dark:text-neutral-300 hover:bg-surface transition-colors"
            >
              {t.installPromptLater}
            </button>
            <button
              onClick={handleInstall}
              className="flex-[2] py-2.5 rounded-xl bg-accent text-accent-text hover:bg-accent-hover transition-colors text-sm font-medium"
            >
              {t.installPromptCta}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default InstallPrompt;
