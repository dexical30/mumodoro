import { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  ListMusic,
  Plus,
  Trash2,
} from "lucide-react";
import {
  usePlaylistStore,
  usePlaylistStoreActions,
} from "@/store/usePlaylistStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Text } from "../ui/text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { YoutubeSearchPanel } from "./YoutubeSearchPanel";

export const Playbar = () => {
  const { playlist, currentVideoIndex, isPlaying } = usePlaylistStore();
  const {
    setPlaying,
    nextTrack,
    addManualVideo,
    removeVideo,
    playVideoAtIndex,
  } = usePlaylistStoreActions();

  const [newUrl, SXNewUrl] = useState("");
  const [newTitle, SXNewTitle] = useState("");

  const currentVideo = playlist[currentVideoIndex];

  const handleAddVideo = () => {
    if (newUrl && newTitle) {
      addManualVideo(newUrl, newTitle);
      SXNewUrl("");
      SXNewTitle("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-[#0D1B2A]/90 backdrop-blur-xl border border-white/10 p-4 rounded-full shadow-2xl flex items-center gap-4 pr-6">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="rounded-full h-12 w-12 bg-white text-[#0D1B2A] hover:bg-white/90"
            onClick={() => setPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-white hover:bg-white/10"
            onClick={nextTrack}
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
        </div>

        <div className="flex flex-col min-w-[120px] max-w-[200px]">
          <Text
            as="span"
            className="text-xs text-white/50 uppercase tracking-wider font-medium"
          >
            Now Playing
          </Text>
          <Text as="span" className="text-sm text-white font-medium truncate">
            {currentVideo?.title || "No Video"}
          </Text>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2" />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 text-white hover:bg-white/10"
            >
              <ListMusic className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0D1B2A] border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Playlist</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/5">
                <Text
                  as="h4"
                  className="text-sm font-medium text-white/70 mb-2"
                >
                  Add New Track
                </Text>
                <div className="flex gap-2">
                  <Input
                    value={newTitle}
                    onChange={(e) => SXNewTitle(e.target.value)}
                    placeholder="Title"
                    className="bg-black/20 border-white/10 h-8 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newUrl}
                    onChange={(e) => SXNewUrl(e.target.value)}
                    placeholder="YouTube URL"
                    className="bg-black/20 border-white/10 h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddVideo}
                    className="bg-orange-500 hover:bg-orange-600 h-8 px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <YoutubeSearchPanel />

              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-2">
                  {playlist.map((video, idx) => (
                    <div
                      key={video.id}
                      className={`flex items-center justify-between p-2 rounded group ${
                        idx === currentVideoIndex
                          ? "bg-white/10 border-l-2 border-orange-500"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <button
                        className="flex flex-1 items-center gap-2 text-left text-sm px-2"
                        onClick={() => playVideoAtIndex(idx)}
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-8 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="h-8 w-12 rounded bg-white/5" />
                        )}
                        <Text
                          as="span"
                          className={
                            idx === currentVideoIndex
                              ? "text-orange-400"
                              : "text-white/80"
                          }
                        >
                          {video.title}
                        </Text>
                      </button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo(video.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
