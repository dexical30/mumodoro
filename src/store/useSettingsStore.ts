import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  alarmVolume: number;
  soundEnabled: boolean;
  videoDisplayed: boolean;
  actions: {
    setAlarmVolume: (volume: number) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setVideoDisplayed: (displayed: boolean) => void;
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      alarmVolume: 0.5,
      soundEnabled: true,
      videoDisplayed: true,
      actions: {
        setAlarmVolume: (volume) => set({ alarmVolume: volume }),
        setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
        setVideoDisplayed: (displayed) => set({ videoDisplayed: displayed }),
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        alarmVolume: state.alarmVolume,
        soundEnabled: state.soundEnabled,
        videoDisplayed: state.videoDisplayed,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<SettingsState>),
        actions: currentState.actions,
      }),
    }
  )
);


export const useSettingsStoreActions = () =>
  useSettingsStore((state) => state.actions);