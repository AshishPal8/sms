import { DEFAULT_DATE_FORMAT } from "@/lib/utils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Settings = {
  id: string;
  key: string;
  dateFormat: string;
};

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  setSettings: (settings: Settings | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getDateFormat: () => string;
  clearSettings: () => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: null,
      loading: false,
      error: null,

      setSettings: (settings) =>
        set({
          settings,
          error: null,
        }),
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),
      getDateFormat: () => {
        const s = get().settings;
        return s?.dateFormat ?? DEFAULT_DATE_FORMAT;
      },
      clearSettings: () =>
        set({
          settings: null,
        }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSettingsStore;
