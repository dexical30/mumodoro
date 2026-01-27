import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  status: "today" | "overday";
  createdAt: string;
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
    refreshTodoStatuses: (now?: number) => void;
    restoreTodoToToday: (id: string) => void;
  };
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const getNowIso = () => new Date().toISOString();

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
                status: "today",
                createdAt: getNowIso(),
                notes: [],
              },
            ],
          })),
        toggleTodo: (id) =>
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
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
        refreshTodoStatuses: (now = Date.now()) =>
          set((state) => {
            let nextActiveTodoId = state.activeTodoId;
            const todos = state.todos.map((todo) => {
              const createdAtMs = Date.parse(todo.createdAt);
              if (
                todo.status === "overday" ||
                Number.isNaN(createdAtMs) ||
                now - createdAtMs < DAY_IN_MS
              ) {
                return todo;
              }
              if (nextActiveTodoId === todo.id) {
                nextActiveTodoId = null;
              }
              return { ...todo, status: "overday" };
            });
            return { todos, activeTodoId: nextActiveTodoId };
          }),
        restoreTodoToToday: (id) =>
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? { ...todo, status: "today", createdAt: getNowIso() }
                : todo
            ),
          })),
      },
    })),
    {
      name: "todo-storage",
      version: 1,
      partialize: (state) => ({
        todos: state.todos,
        activeTodoId: state.activeTodoId,
      }),
      migrate: (persistedState) => {
        const state = persistedState as {
          todos?: Todo[];
          activeTodoId?: string | null;
        };
        const nowIso = getNowIso();
        return {
          todos: (state.todos ?? []).map((todo) => ({
            ...todo,
            status: todo.status ?? "today",
            createdAt: todo.createdAt ?? nowIso,
            notes: todo.notes ?? [],
          })),
          activeTodoId: state.activeTodoId ?? null,
        };
      },
    }
  )
);

export const useTodoStoreActions = () => useTodoStore((state) => state.actions);
