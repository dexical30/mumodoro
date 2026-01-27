export const isYoutubeUrl = (url: string) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

export const extractPlaylistId = (url: string) => {
  const urlObj = new URL(url);
  if (isYoutubeUrl(url)) {
    return urlObj.searchParams.get("list");
  }
  return null;
};

export const extractVideoId = (url: string) => {
  const urlObj = new URL(url);
  if (isYoutubeUrl(url)) {
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1);
    }
    return urlObj.searchParams.get("v");
  }
  return null;
};

export const buildYoutubeUrl = (params: {
  videoId?: string | null;
  playlistId?: string | null;
  fallbackUrl?: string | null;
}) => {
  if (params.fallbackUrl) {
    return params.fallbackUrl;
  }
  if (params.playlistId) {
    return `https://www.youtube.com/playlist?list=${params.playlistId}`;
  }
  if (params.videoId) {
    return `https://www.youtube.com/watch?v=${params.videoId}`;
  }
  return "";
};

export const buildYoutubeThumbnail = (videoId?: string | null) => {
  if (!videoId) {
    return "";
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};
