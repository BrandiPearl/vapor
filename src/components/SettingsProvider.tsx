"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  type SiteSettings,
} from "@/lib/settings";

type SettingsState = {
  settings: SiteSettings;
  /** False until /api/settings answers, so gated screens can wait. */
  loaded: boolean;
};

const SettingsContext = createContext<SettingsState>({
  settings: DEFAULT_SETTINGS,
  loaded: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SettingsState>({
    settings: DEFAULT_SETTINGS,
    loaded: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/settings", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setState({
          settings: data ? normalizeSettings(data) : DEFAULT_SETTINGS,
          loaded: true,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ settings: DEFAULT_SETTINGS, loaded: true });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <SettingsContext.Provider value={state}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
