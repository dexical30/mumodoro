import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export interface Video {
  id: string;
  url: string;
  title: string;
}

// Initial lofi playlist
const INITIAL_PLAYLIST: Video[] = [
  {
    id: "1",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    title: "Lofi Girl - lofi hip hop radio",
  },
  {
    id: "2",
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
    title: "Synthwave Radio",
  },
  {
    id: "3",
    url: "https://www.youtube.com/watch?v=DWcJFNfaw9c",
    title: "Ambient Study Music",
  },
];

interface PlaylistState {
  playlist: Video[];
  currentVideoIndex: number;
  isPlaying: boolean;
  actions: {
    addVideo: (url: string, title: string) => void;
    removeVideo: (id: string) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setPlaying: (isPlaying: boolean) => void;
    playVideoAtIndex: (index: number) => void;
  };
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    subscribeWithSelector((set) => ({
      playlist: INITIAL_PLAYLIST,
      currentVideoIndex: 0,
      isPlaying: false,
      actions: {
        addVideo: (url, title) =>
          set((state) => ({
            playlist: [
              ...state.playlist,
              { id: crypto.randomUUID(), url, title },
            ],
          })),
        removeVideo: (id) =>
          set((state) => ({
            playlist: state.playlist.filter((v) => v.id !== id),
            // Adjust index if needed, simplistic for now
            currentVideoIndex: 0,
          })),
        nextTrack: () =>
          set((state) => ({
            currentVideoIndex:
              (state.currentVideoIndex + 1) % state.playlist.length,
          })),
        prevTrack: () =>
          set((state) => ({
            currentVideoIndex:
              state.currentVideoIndex === 0
                ? state.playlist.length - 1
                : state.currentVideoIndex - 1,
          })),
        setPlaying: (isPlaying) => set({ isPlaying }),
        playVideoAtIndex: (index) =>
          set({ currentVideoIndex: index, isPlaying: true }),
      },
    })),
    {
      name: "playlist-storage",
      partialize: (state) => ({
        playlist: state.playlist,
        currentVideoIndex: state.currentVideoIndex,
        isPlaying: state.isPlaying,
      }),
    }
  )
);

export const usePlaylistStoreActions = () =>
  usePlaylistStore((state) => state.actions);
