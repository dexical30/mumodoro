import { usePlaylistStore } from "../../../store/usePlaylistStore";
import YoutubePlayerSyncStore from "./youtube-player/youtube-player-sync-store";
import { useSettingsStore } from "../../../store/useSettingsStore";

export const BackgroundPlayer = () => {
  const { playlist } = usePlaylistStore();
  const { videoDisplayed } = useSettingsStore();

  if (!playlist.length) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Overlay to dim the video and ensure text readability */}
      <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-sm" />

      {!videoDisplayed && (
        <div className="absolute inset w-full h-full bg-black z-10 backdrop-blur-sm" />
      )}
      <div className="relative w-[300%] h-[300%] -left-[100%] -top-[100%] pointer-events-none">
        <YoutubePlayerSyncStore />
      </div>
    </div>
  );
};
