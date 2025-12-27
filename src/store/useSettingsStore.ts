import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  alarmVolume: number;
  soundEnabled: boolean;
  actions: {
    setAlarmVolume: (volume: number) => void;
    setSoundEnabled: (enabled: boolean) => void;
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      alarmVolume: 0.5,
      soundEnabled: true,
      actions: {
        setAlarmVolume: (volume) => set({ alarmVolume: volume }),
        setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);

