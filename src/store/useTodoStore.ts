import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  completedAt: string | null;
  notes: string[]; // Notes added after sessions
}

interface TodoState {
  todos: Todo[];
  activeTodoId: string | null;
  actions: {
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    setActiveTodo: (id: string | null) => void;
    addNoteToTodo: (id: string, note: string) => void;
  };
}

export const useTodoStore = create<TodoState>()(
  persist(
    subscribeWithSelector((set) => ({
      todos: [],
      activeTodoId: null,
      actions: {
        addTodo: (text) =>
          set((state) => ({
            todos: [
              ...state.todos,
              {
                id: crypto.randomUUID(),
                text,
                completed: false,
                completedAt: null,
                notes: [],
              },
            ],
          })),
        toggleTodo: (id) =>
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id
                ? {
                    ...t,
                    completed: !t.completed,
                    completedAt: t.completed ? null : new Date().toISOString(),
                  }
                : t
            ),
          })),
        deleteTodo: (id) =>
          set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
            activeTodoId: state.activeTodoId === id ? null : state.activeTodoId,
          })),
        setActiveTodo: (id) => set({ activeTodoId: id }),
        addNoteToTodo: (id, note) =>
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, notes: [...t.notes, note] } : t
            ),
          })),
      },
    })),
    {
      name: "todo-storage",
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }
        const state = persistedState as Pick<TodoState, "todos" | "activeTodoId">;
        return {
          ...state,
          todos: (state.todos ?? []).map((todo) => ({
            ...todo,
            completedAt:
              todo.completedAt ?? (todo.completed ? new Date().toISOString() : null),
          })),
        };
      },
      partialize: (state) => ({
        todos: state.todos,
        activeTodoId: state.activeTodoId,
      }),
    }
  )
);

export const useTodoStoreActions = () => useTodoStore((state) => state.actions);
