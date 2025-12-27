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
