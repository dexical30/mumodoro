import type { Todo } from "../store/useTodoStore";

const getStartOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const getEndOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const isWithinDay = (date: Date, day: Date) => {
  const start = getStartOfDay(day);
  const end = getEndOfDay(day);
  return date >= start && date <= end;
};

const formatShortDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}`;

export const getTodayCompletedTodos = (todos: Todo[], now = new Date()) => {
  const completedTodos = todos.filter((todo) => {
    if (!todo.completedAt) {
      return false;
    }
    const completedDate = new Date(todo.completedAt);
    return isWithinDay(completedDate, now);
  });

  return {
    count: completedTodos.length,
    todos: completedTodos,
  };
};

export const getWeeklyCompletionCounts = (todos: Todo[], now = new Date()) => {
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - index));
    return day;
  });

  return days.map((day) => {
    const count = todos.filter((todo) => {
      if (!todo.completedAt) {
        return false;
      }
      const completedDate = new Date(todo.completedAt);
      return isWithinDay(completedDate, day);
    }).length;

    return {
      date: formatShortDate(day),
      count,
    };
  });
};
