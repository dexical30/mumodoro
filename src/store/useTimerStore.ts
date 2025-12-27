import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const DEFAULT_TIMES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface TimerState {
  timerMode: TimerMode;
  timeLeft: number;
  durations: Record<TimerMode, number>;
  isTimerRunning: boolean;
  actions: {
    setTimerMode: (mode: TimerMode) => void;
    updateDuration: (mode: TimerMode, duration: number) => void;
    setTimerRunning: (isRunning: boolean) => void;
    tickTimer: () => void;
    resetTimer: () => void;
  };
}

export const useTimerStore = create<TimerState>()(
  persist(
    subscribeWithSelector((set) => ({
      timerMode: "pomodoro",
      durations: DEFAULT_TIMES,
      timeLeft: DEFAULT_TIMES.pomodoro,
      isTimerRunning: false,
      actions: {
        setTimerMode: (mode) =>
          set((state) => ({
            timerMode: mode,
            timeLeft: state.durations[mode],
            isTimerRunning: false,
          })),
        updateDuration: (mode, duration) =>
          set((state) => ({
            durations: { ...state.durations, [mode]: duration },
            // Only update timeLeft if we are currently in that mode and timer is not running (optional behavior)
            // Or update it anyway if we want immediate feedback
            timeLeft: state.timerMode === mode ? duration : state.timeLeft,
            isTimerRunning: false,
          })),
        setTimerRunning: (isRunning) => set({ isTimerRunning: isRunning }),
        tickTimer: () =>
          set((state) => {
            if (state.timeLeft <= 0) return { isTimerRunning: false };
            return { timeLeft: state.timeLeft - 1 };
          }),
        resetTimer: () =>
          set((state) => ({
            timeLeft: state.durations[state.timerMode],
            isTimerRunning: false,
          })),
      },
    })),
    {
      name: "timer-storage",
      partialize: (state) => ({
        timerMode: state.timerMode,
        timeLeft: state.timeLeft,
        durations: state.durations,
        isTimerRunning: state.isTimerRunning,
      }),
    }
  )
);

export const useTimerStoreActions = () =>
  useTimerStore((state) => state.actions);
