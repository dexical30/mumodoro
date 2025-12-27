import { useRef, useEffect, useLayoutEffect } from "react";
import { YoutubePlayer } from "./youtube-player";

const useYoutubePlayer = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const player = useRef(YoutubePlayer.getInstance());

  useLayoutEffect(() => {
    // javascript load
  }, []);

  return { domRef, player };
};
