import { useEffect, useRef, useState } from "react";
import type { Episode, Media, PayloadListResponse } from "@schnitzel/shared";
import { formatDate } from "@schnitzel/shared";
import Typography from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveMediaUrl } from "@/lib/payload";

interface EpisodesListProps {
  initialDocs: Episode[];
  initialSearch?: string;
  initialSort?: string;
  initialPage?: number;
  initialHasNextPage?: boolean;
  fetchOnMount?: boolean;
}

type FiltersChangeDetail = {
  search?: string;
  sort?: string;
};

const LIMIT = 12;

function EpisodeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden md:h-122 md:flex-row">
      <Skeleton className="h-64 w-full shrink-0 md:aspect-814/488 md:h-full md:w-auto" />

      <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-6 md:px-10 md:py-10">
        <Skeleton className="h-12 w-56 bg-secondary/25" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-full max-w-xl" />
        <Skeleton className="h-7 w-11/12 max-w-xl" />
      </div>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: Episode }) {
  const coverImage =
    episode.coverImage && typeof episode.coverImage === "object"
      ? (episode.coverImage as Media)
      : null;
  const coverUrl = resolveMediaUrl(coverImage?.url);
  const [isImageLoading, setIsImageLoading] = useState(Boolean(coverUrl));

  return (
    <a
      href={`/episodes/${episode.slug}`}
      className="group flex flex-col overflow-hidden transition-opacity hover:opacity-90 md:h-122 md:flex-row"
    >
      <div className="relative h-64 w-full shrink-0 overflow-hidden md:aspect-814/488 md:h-full md:w-auto">
        {coverUrl && isImageLoading && (
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        )}

        {coverUrl ? (
          <img
            src={coverUrl}
            alt={episode.guestName}
            width={814}
            height={488}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            className={`h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-6 md:px-10 md:py-10">
        <div className="inline-block self-start bg-secondary px-4 py-2.5">
          <Typography
            tag="h3"
            variant="h3"
            uppercase={true}
            className="text-primary-foreground"
          >
            Episode #{episode.episodeNumber}&nbsp;{episode.guestName}
          </Typography>
        </div>

        {episode.publishedAt && (
          <Typography tag="p" variant="caption" className="text-[#7492B2]">
            {formatDate(episode.publishedAt)}
          </Typography>
        )}

        <Typography
          tag="p"
          variant="body-lg"
          className="line-clamp-4 max-w-xl text-secondary"
        >
          {episode.description}
        </Typography>
      </div>
    </a>
  );
}

export default function EpisodesList({
  initialDocs,
  initialSearch = "",
  initialSort = "-episodeNumber",
  initialPage = 1,
  initialHasNextPage = false,
  fetchOnMount = false,
}: EpisodesListProps) {
  const [docs, setDocs] = useState<Episode[]>(initialDocs);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  async function fetchPage({
    nextSearch,
    nextSort,
    nextPage,
    replace,
  }: {
    nextSearch: string;
    nextSort: string;
    nextPage: number;
    replace: boolean;
  }) {
    if (isLoading) return;

    setIsLoading(true);
    setIsReplacing(replace);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextSort && nextSort !== "-episodeNumber") {
        params.set("sort", nextSort);
      }
      params.set("page", String(nextPage));
      params.set("limit", String(LIMIT));

      const response = await fetch(`/api/episodes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch episodes");

      const data: PayloadListResponse<Episode> = await response.json();

      setDocs(current => (replace ? data.docs : [...current, ...data.docs]));
      setPage(data.page);
      setHasNextPage(data.hasNextPage);
    } catch {
      setError("Could not load episodes. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsReplacing(false);
    }
  }

  useEffect(() => {
    if (!fetchOnMount) return;

    void fetchPage({
      nextSearch: initialSearch,
      nextSort: initialSort,
      nextPage: 1,
      replace: true,
    });
  }, [fetchOnMount, initialSearch, initialSort]);

  useEffect(() => {
    function onFiltersChange(event: Event) {
      const customEvent = event as CustomEvent<FiltersChangeDetail>;
      const nextSearch = customEvent.detail?.search ?? "";
      const nextSort = customEvent.detail?.sort ?? "-episodeNumber";

      setSearch(nextSearch);
      setSort(nextSort);
      setPage(1);
      setHasNextPage(false);
      void fetchPage({
        nextSearch,
        nextSort,
        nextPage: 1,
        replace: true,
      });
    }

    function onPopState() {
      const params = new URLSearchParams(window.location.search);
      const nextSearch = params.get("search") ?? "";
      const nextSort = params.get("sort") ?? "-episodeNumber";

      setSearch(nextSearch);
      setSort(nextSort);
      setPage(1);
      setHasNextPage(false);
      void fetchPage({
        nextSearch,
        nextSort,
        nextPage: 1,
        replace: true,
      });
    }

    window.addEventListener("episodes:filters-change", onFiltersChange);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("episodes:filters-change", onFiltersChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isLoading && hasNextPage) {
          void fetchPage({
            nextSearch: search,
            nextSort: sort,
            nextPage: page + 1,
            replace: false,
          });
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isLoading, page, search, sort]);

  return (
    <>
      {isReplacing && (
        <div className="flex flex-col gap-10" aria-hidden="true">
          <EpisodeCardSkeleton />
          <EpisodeCardSkeleton />
          <EpisodeCardSkeleton />
        </div>
      )}

      {error ? (
        <p className="py-16 text-center text-muted-foreground">{error}</p>
      ) : !isReplacing && docs.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {search
            ? `No episodes found for "${search}".`
            : "No episodes published yet."}
        </p>
      ) : !isReplacing ? (
        <div className="flex flex-col gap-10">
          {docs.map(episode => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      ) : null}

      {!isReplacing && (
        <>
          <div ref={sentinelRef} className="h-1 w-full" />

          {isLoading && (
            <p className="pt-6 text-center text-muted-foreground">
              Loading more episodes…
            </p>
          )}
        </>
      )}
    </>
  );
}
