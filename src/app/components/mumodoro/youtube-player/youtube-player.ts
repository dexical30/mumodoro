// https://developers.google.com/youtube/iframe_api_reference?hl=ko

import { extractPlaylistId, extractVideoId, isYoutubeUrl } from "./util";

export class YoutubePlayer {
  private static instance: YoutubePlayer;
  private player: any;
  private currentLink: string | null = null;

  constructor() {
    if (YoutubePlayer.instance) {
      return YoutubePlayer.instance;
    }
    YoutubePlayer.instance = this;
    this.init();
  }

  static getInstance(): YoutubePlayer {
    if (!YoutubePlayer.instance) {
      YoutubePlayer.instance = new YoutubePlayer();
    }
    return YoutubePlayer.instance;
  }

  init() {
    if (!this.isInitialized()) {
      return;
    }
  }

  isInitialized() {
    if (typeof window === "undefined") return false;
    return !!window.YT;
  }

  setPlayer(domId: string) {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.isInitialized()) {
      return;
    }

    window.YT.ready(() => {
      this.player = new window.YT.Player(domId, {
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: this.onReady.bind(this),
          onStop: this.onStop.bind(this),
        },
      });
      if (this.currentLink) {
        this.changeVideo(this.currentLink);
      }
    });
  }

  changeVideo(link: string) {
    console.log("currentLink", this.currentLink);
    this.currentLink = link;
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "changeVideo called in server-side context or player not initialized"
      );
      return;
    }

    if (!isYoutubeUrl(link)) {
      throw new Error(`Invalid YouTube URL: ${link}`);
    }

    if (!this.isInitialized()) {
      return;
    }

    const url = new URL(link);

    const isPlaylist = url.pathname.includes("playlist");
    console.log(this.player);

    // playlist일경우
    if (isPlaylist) {
      try {
        this.player.loadPlaylist({
          list: extractPlaylistId(link),
          index: 0,
          startSeconds: 0,
          listType: "playlist",
          suggestedQuality: "small",
        });
        // this.player.options.playerVars.listType = "playlist";
        // this.player.options.playerVars.list =
        //   "PL_D2YrKeYY2UvRIw_SW3lQXzBDO7aBeii";
        console.log(
          "Changed playlist to:",
          extractPlaylistId(link),
          this.player
        );
        return;
      } catch (error) {
        console.error("Error changing playlist:", error);
      }
    }

    const videoId = extractVideoId(link);
    if (!videoId) {
      console.error("Invalid YouTube URL:", link);
      return;
    }

    console.log("Changing video to:", videoId);

    try {
      this.player.loadVideoById({
        videoId: videoId,
        startSeconds: 0,
        suggestedQuality: "small",
      });
    } catch (error) {
      console.error("Error changing video:", error);
    }
  }

  play() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "play called in server-side context or player not initialized"
      );
      return;
    }
    this.player.playVideo();
  }

  pause() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "pause called in server-side context or player not initialized"
      );
      return;
    }
    this.player.pauseVideo();
  }

  next() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "next called in server-side context or player not initialized"
      );
      return;
    }
    this.player.nextVideo();
  }

  previous() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "previous called in server-side context or player not initialized"
      );
      return;
    }
    this.player.previousVideo();
  }

  getVolume() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "getVolume called in server-side context or player not initialized"
      );
      return 0;
    }
    return this.player.getVolume();
  }

  setVolume(volume: number) {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "setVolume called in server-side context or player not initialized"
      );
      return;
    }
    this.player.setVolume(volume);
  }

  mute() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "mute called in server-side context or player not initialized"
      );
      return;
    }
    this.player.mute();
  }

  unmute() {
    if (typeof window === "undefined" || !this.player) {
      console.warn(
        "unmute called in server-side context or player not initialized"
      );
      return;
    }
    this.player.unmute();
  }

  onReady(event: any) {
    this.play();
    this.setVolume(30);
  }

  onStop(event: any) {
    console.log("onStop", event);
  }

  destory() {
    this.player.destroy();
  }
}
