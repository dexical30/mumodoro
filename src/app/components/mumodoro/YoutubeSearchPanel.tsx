import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Text } from "../ui/text";
import { usePlaylistStoreActions } from "@/store/usePlaylistStore";

interface YoutubeSearchResult {
  id: string;
  type: "video" | "playlist";
  title: string;
  thumbnail: string;
  channelTitle: string;
  videoId?: string;
  playlistId?: string;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;

export const YoutubeSearchPanel = () => {
  const { addYoutubeItem } = usePlaylistStoreActions();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YoutubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMessage("검색어를 입력해주세요.");
      setResults([]);
      return;
    }

    if (!API_KEY) {
      setErrorMessage(
        "YouTube Data API 키가 설정되지 않았습니다. VITE_YOUTUBE_API_KEY를 등록해주세요."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video,playlist",
        maxResults: "10",
        q: trimmed,
        key: API_KEY,
      });
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("YouTube 검색 요청에 실패했습니다.");
      }

      const data = await response.json();
      const nextResults: YoutubeSearchResult[] = (data.items ?? []).map(
        (item: any) => {
          const kind: string = item.id?.kind ?? "";
          const type = kind.includes("playlist") ? "playlist" : "video";
          const snippet = item.snippet ?? {};
          const thumbnail =
            snippet.thumbnails?.medium?.url ??
            snippet.thumbnails?.default?.url ??
            "";

          return {
            id: item.etag ?? `${item.id?.videoId ?? item.id?.playlistId}`,
            type,
            title: snippet.title ?? "Untitled",
            thumbnail,
            channelTitle: snippet.channelTitle ?? "",
            videoId: item.id?.videoId ?? undefined,
            playlistId: item.id?.playlistId ?? undefined,
          };
        }
      );
      setResults(nextResults);
      if (!nextResults.length) {
        setErrorMessage("검색 결과가 없습니다.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("검색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: YoutubeSearchResult) => {
    addYoutubeItem({
      title: result.title,
      videoId: result.videoId,
      playlistId: result.playlistId,
      thumbnail: result.thumbnail,
      playOnAdd: true,
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
      <Text as="h4" className="text-sm font-medium text-white/70">
        YouTube 검색
      </Text>
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="검색어 입력"
          className="bg-black/20 border-white/10 h-8 text-sm"
        />
        <Button
          size="sm"
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 h-8 px-3"
          disabled={isLoading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {errorMessage && (
        <Text as="p" className="text-xs text-orange-200/80">
          {errorMessage}
        </Text>
      )}

      <ScrollArea className="h-[220px] pr-3">
        <div className="space-y-2">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleSelect(result)}
              className="flex w-full items-center gap-3 rounded-md border border-white/10 bg-black/20 p-2 text-left transition hover:bg-black/30"
            >
              <div className="h-12 w-20 overflow-hidden rounded-md bg-black/40">
                {result.thumbnail ? (
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <Text as="p" className="text-sm text-white/90 truncate">
                  {result.title}
                </Text>
                <Text as="p" className="text-xs text-white/50">
                  {result.channelTitle}
                </Text>
              </div>
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase text-white/60">
                {result.type}
              </span>
              <Plus className="h-4 w-4 text-white/60" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
