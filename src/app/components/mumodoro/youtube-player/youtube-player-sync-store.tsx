import React, { useEffect, useRef } from "react";
import { YoutubePlayer } from "./youtube-player";
import { getPlaylistItemUrl, usePlaylistStore } from "@/store/usePlaylistStore";

interface YoutubePlayerSyncStoreProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "id" | "ref"
  > {}

const YoutubePlayerSyncStore = (props: YoutubePlayerSyncStoreProps) => {
  const domRef = useRef<HTMLDivElement>(null);
  const player = useRef(YoutubePlayer.getInstance());

  // play 상태처리
  useEffect(() => {
    return usePlaylistStore.subscribe(
      (state) => state.isPlaying,
      (isPlaying) => {
        if (isPlaying) {
          player.current.play();
        } else {
          player.current.pause();
        }
      },
      {
        fireImmediately: true,
      }
    );
  }, []);

  // 비디오 변경 상태처리
  useEffect(() => {
    return usePlaylistStore.subscribe(
      (state) => state.playlist[state.currentVideoIndex],
      (currentVideo) => {
        const nextUrl = getPlaylistItemUrl(currentVideo);
        if (nextUrl) {
          player.current.changeVideo(nextUrl);
        }
      },
      {
        fireImmediately: true,
      }
    );
  }, []);

  useEffect(() => {
    if (domRef.current) {
      player.current.setPlayer(domRef.current.id);
    }
  }, [domRef]);

  return <div id="youtube-player-dom" ref={domRef} {...props}></div>;
};

export default YoutubePlayerSyncStore;
