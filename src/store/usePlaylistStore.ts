import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import {
  buildYoutubeThumbnail,
  buildYoutubeUrl,
  extractPlaylistId,
  extractVideoId,
} from "@/app/components/mumodoro/youtube-player/util";

export type PlaylistSource = "youtube";

export interface PlaylistItem {
  id: string;
  title: string;
  source: PlaylistSource;
  url?: string;
  videoId?: string;
  playlistId?: string;
  thumbnail?: string;
}

// Initial lofi playlist
const INITIAL_PLAYLIST: PlaylistItem[] = [
  {
    id: "1",
    title: "Lofi Girl - lofi hip hop radio",
    source: "youtube",
    videoId: "jfKfPfyJRdk",
    thumbnail: buildYoutubeThumbnail("jfKfPfyJRdk"),
  },
  {
    id: "2",
    title: "Synthwave Radio",
    source: "youtube",
    videoId: "4xDzrJKXOOY",
    thumbnail: buildYoutubeThumbnail("4xDzrJKXOOY"),
  },
];

interface PlaylistState {
  playlist: PlaylistItem[];
  currentVideoIndex: number;
  isPlaying: boolean;
  actions: {
    addManualVideo: (url: string, title: string) => void;
    addYoutubeItem: (item: {
      videoId?: string;
      playlistId?: string;
      title: string;
      thumbnail?: string;
      playOnAdd?: boolean;
    }) => void;
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
        addManualVideo: (url, title) => {
          let videoId: string | null = null;
          let playlistId: string | null = null;

          try {
            videoId = extractVideoId(url);
            playlistId = extractPlaylistId(url);
          } catch (error) {
            console.warn("Invalid YouTube URL provided:", error);
          }

          set((state) => ({
            playlist: [
              ...state.playlist,
              {
                id: crypto.randomUUID(),
                title,
                source: "youtube",
                url,
                videoId: videoId ?? undefined,
                playlistId: playlistId ?? undefined,
                thumbnail: buildYoutubeThumbnail(videoId),
              },
            ],
          }));
        },
        addYoutubeItem: ({ videoId, playlistId, title, thumbnail, playOnAdd }) =>
          set((state) => {
            const nextItem: PlaylistItem = {
              id: crypto.randomUUID(),
              title,
              source: "youtube",
              videoId,
              playlistId,
              thumbnail,
              url: buildYoutubeUrl({
                videoId,
                playlistId,
              }),
            };
            const nextPlaylist = [...state.playlist, nextItem];
            const nextIndex = nextPlaylist.length - 1;

            return {
              playlist: nextPlaylist,
              ...(playOnAdd
                ? { currentVideoIndex: nextIndex, isPlaying: true }
                : {}),
            };
          }),
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

export const getPlaylistItemUrl = (item?: PlaylistItem | null) => {
  if (!item) {
    return "";
  }
  return buildYoutubeUrl({
    videoId: item.videoId,
    playlistId: item.playlistId,
    fallbackUrl: item.url,
  });
};
