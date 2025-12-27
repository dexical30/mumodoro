import React, { useEffect, useState } from "react";
import { useTimerStore } from "../../../store/useTimerStore";
import { useTodoStore } from "../../../store/useTodoStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Text } from "../ui/text";

export const MemoDialog = () => {
  const {
    timeLeft,
    timerMode,
    actions: { resetTimer, setTimerMode },
  } = useTimerStore();

  const {
    activeTodoId,
    todos,
    actions: { addNoteToTodo },
  } = useTodoStore();

  const [isOpen, setIsOpen] = useState(false);
  const [memo, setMemo] = useState("");

  const activeTodo = todos.find((t) => t.id === activeTodoId);

  useEffect(() => {
    // Open dialog when timer hits 0 during a pomodoro session and there is an active task
    if (timeLeft === 0 && timerMode === "pomodoro" && activeTodoId) {
      setIsOpen(true);
    }
  }, [timeLeft, timerMode, activeTodoId]);

  const handleSave = () => {
    if (activeTodoId && memo.trim()) {
      // Format the note with a timestamp or just the text
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      addNoteToTodo(activeTodoId, `[${timestamp}] ${memo}`);
    }
    setMemo("");
    setIsOpen(false);

    // Auto transition logic could go here, for now just reset
    resetTimer();
    setTimerMode("shortBreak"); // Suggest break
  };

  const handleSkip = () => {
    setIsOpen(false);
    resetTimer();
    setTimerMode("shortBreak");
  };

  if (!activeTodo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#0D1B2A] border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Session Complete!</DialogTitle>
          <DialogDescription className="text-white/60">
            You just focused on{" "}
            <Text as="span" className="text-orange-400 font-medium">
              "{activeTodo.text}"
            </Text>
            . Write a quick note about what you accomplished or learned.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="I finished the layout and added responsive styles..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px]"
          />
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white/50 hover:text-white"
          >
            Skip
          </Button>
          <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
