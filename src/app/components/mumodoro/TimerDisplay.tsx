import { useEffect } from "react";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { useTimerStore, useTimerStoreActions } from "@/store/useTimerStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export const TimerDisplay = () => {
  const { timeLeft, isTimerRunning, timerMode, durations } = useTimerStore();
  const {
    setTimerRunning,
    tickTimer,
    resetTimer,
    setTimerMode,
    updateDuration,
  } = useTimerStoreActions();

  const { activeTodoId, todos } = useTodoStore();

  const { alarmVolume, soundEnabled } = useSettingsStore();

  const playAlarm = () => {
    if (!soundEnabled || alarmVolume === 0) return;

    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(alarmVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleAdjustTime = (amount: number) => {
    const newDuration = Math.max(60, durations[timerMode] + amount);
    updateDuration(timerMode, newDuration);
  };

  const activeTodo = todos.find((t) => t.id === activeTodoId);

  useEffect(() => {
    let interval: number;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setTimerRunning(false);
      playAlarm();
      // Logic for opening memo modal will be handled by a listener in App or MemoDialog
    }
    return () => clearInterval(interval);
  }, [
    isTimerRunning,
    timeLeft,
    tickTimer,
    setTimerRunning,
    alarmVolume,
    soundEnabled,
  ]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getModeLabel = () => {
    switch (timerMode) {
      case "pomodoro":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {activeTodo && timerMode === "pomodoro" ? (
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Text
            as="p"
            className="text-white/60 text-sm uppercase tracking-widest mb-2"
          >
            Current Task
          </Text>
          <Text as="h2" className="text-3xl md:text-4xl font-light text-white">
            {activeTodo.text}
          </Text>
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-white/40 text-sm tracking-widest uppercase">
          <Text as="span">
            {timerMode === "pomodoro"
              ? "Select a task to start"
              : getModeLabel()}
          </Text>
        </div>
      )}

      <div className="flex items-center gap-4 md:gap-8">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/20 hover:text-white/60 hover:bg-white/5 rounded-full h-12 w-12"
          onClick={() => handleAdjustTime(-60)}
          disabled={isTimerRunning}
          title="Decrease time (1 min)"
        >
          <Minus className="h-8 w-8" />
        </Button>

        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div
            contentEditable={!isTimerRunning}
            suppressContentEditableWarning
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            onBlur={(e) => {
              const text = e.currentTarget.innerText;
              const parts = text.split(":");
              let minutes = parseInt(parts[0] || "0");
              let seconds = parts.length > 1 ? parseInt(parts[1] || "0") : 0;

              if (!isNaN(minutes) && !isNaN(seconds)) {
                const totalSeconds = minutes * 60 + seconds;
                if (totalSeconds > 0) {
                  updateDuration(timerMode, totalSeconds);
                  return;
                }
              }
              e.currentTarget.innerText = formatTime(timeLeft);
            }}
            className={`relative text-[6rem] md:text-[10rem] font-bold text-white leading-none tracking-tighter font-mono outline-none min-w-[3ch] text-center ${
              !isTimerRunning
                ? "cursor-text hover:text-white/90"
                : "cursor-default"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white/20 hover:text-white/60 hover:bg-white/5 rounded-full h-12 w-12"
          onClick={() => handleAdjustTime(60)}
          disabled={isTimerRunning}
          title="Increase time (1 min)"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>

      <div className="flex items-center gap-4 z-20">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white backdrop-blur-sm"
          onClick={() => setTimerRunning(!isTimerRunning)}
        >
          {isTimerRunning ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full text-white/50 hover:text-white hover:bg-white/10"
          onClick={resetTimer}
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex gap-2">
        {(["pomodoro", "shortBreak", "longBreak"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTimerMode(mode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              timerMode === mode
                ? "bg-white text-[#0D1B2A] shadow-lg scale-105"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {mode === "pomodoro"
              ? "Focus"
              : mode === "shortBreak"
              ? "Short Break"
              : "Long Break"}
          </button>
        ))}
      </div>
    </div>
  );
};
