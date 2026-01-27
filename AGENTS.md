# AGENTS.md

## Project summary
- Pomodoro music timer single-page app built with React and Vite. `npm run dev` starts the Vite dev server.

## Tech stack
- React 19 + TypeScript.
- Vite build tooling.
- Zustand for state management (with persistence to localStorage).
- Tailwind CSS (via Vite + PostCSS).
- Component/UI libraries: Radix UI, MUI, Emotion, Lucide, Sonner, Recharts.

## Folder structure
- `src/main.tsx`: app entry.
- `src/app/App.tsx`: main app layout.
- `src/app/components/mumodoro/`: pomodoro/timer UI features.
- `src/app/components/ui/`: shared UI components.
- `src/providers/`: providers (theme).
- `src/screens/`: route-level screens.
- `src/store/`: Zustand stores.
- `src/styles/`: global styles and theme CSS.

## Data storage (database)
- No server-side database. State is persisted in browser localStorage via Zustand:
  - `todo-storage` (todos, activeTodoId).
  - `timer-storage` (timer mode, durations, timeLeft, running state).
  - `settings-storage` (alarmVolume, soundEnabled).
  - `playlist-storage` (playlist entries, current index, play state).
