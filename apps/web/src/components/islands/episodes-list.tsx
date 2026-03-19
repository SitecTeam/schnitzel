import { useCallback, useEffect, useRef, useState } from "react";
import type { Episode, Media, PayloadListResponse } from "@schnitzel/shared";
import { formatDate } from "@schnitzel/shared";
import Typography from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveMediaUrl } from "@/lib/payload";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col overflow-hidden lg:flex-row">
      <Skeleton className="h-100 w-full shrink-0 sm:h-110 lg:aspect-814/488 lg:h-auto lg:max-h-122 lg:w-3/5 xl:w-[49.5%]" />

      <div className="mt-3 flex flex-1 flex-col justify-center gap-3 lg:mt-0 lg:gap-4 lg:px-10 lg:py-10">
        <Skeleton className="h-15 w-full rounded-none bg-secondary/25 lg:h-19.5 lg:w-140" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-7.5 w-full max-w-xl" />
        <Skeleton className="h-14 w-11/12 max-w-xl rounded-none bg-primary/25 lg:hidden" />
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Already loaded (cached or fast response before hydration)
    if (img.complete && img.naturalWidth > 0) {
      setIsImageLoaded(true);
      return;
    }

    const onLoad = () => setIsImageLoaded(true);
    const onError = () => setIsImageLoaded(true);
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [coverUrl]);

  return (
    <div className="group relative flex flex-col overflow-hidden lg:cursor-pointer lg:flex-row">
      <a
        href={`/episodes/${episode.slug}`}
        className="absolute inset-0 z-30 hidden lg:block"
        aria-label={`Episode #${episode.episodeNumber} ${episode.title}`}
      />
      <div className="relative h-100 w-full shrink-0 overflow-hidden sm:h-110 lg:aspect-814/488 lg:h-auto lg:max-h-122 lg:w-3/5 xl:w-[49.5%]">
        {coverUrl && !isImageLoaded && (
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        )}

        {coverUrl ? (
          <img
            ref={imgRef}
            src={coverUrl}
            alt={episode.title}
            width={814}
            height={488}
            loading="lazy"
            decoding="async"
            className={cn(
              "h-full w-full object-cover transition-transform duration-200 ease-out lg:group-hover:scale-105",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[#FF62AC4D] opacity-0 transition-opacity duration-200 lg:group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center opacity-0 transition-opacity duration-200 lg:flex lg:group-hover:opacity-100">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
            <Play className="size-7" />
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-center gap-3 lg:mt-0 lg:gap-4 lg:px-10 lg:py-10">
        <div className="relative inline-block w-full self-start overflow-hidden bg-secondary px-4 py-2.5 lg:w-auto">
          <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-primary transition-[width] duration-200 ease-out lg:group-hover:w-full" />
          <Typography
            tag="h3"
            variant="h3"
            uppercase={true}
            className="relative z-10 line-clamp-2 text-primary-foreground"
          >
            Episode #{episode.episodeNumber} <wbr />
            {episode.title}
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
        <a
          href={`/episodes/${episode.slug}`}
          className="relative z-20 flex h-fit w-full justify-between border-2 border-primary bg-transparent px-4 py-3.5 text-primary lg:hidden"
        >
          <Typography tag="span" variant="button-regular">
            Listen Now
          </Typography>
          <Play className="size-5 shrink-0" />
        </a>
      </div>
    </div>
  );
}

export default function EpisodesList({
  initialDocs,
  initialSearch = "",
  initialSort = "newest",
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
  const [isReplacing, setIsReplacing] = useState(
    fetchOnMount && initialDocs.length === 0
  );
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async ({
      nextSearch,
      nextSort,
      nextPage,
      replace,
    }: {
      nextSearch: string;
      nextSort: string;
      nextPage: number;
      replace: boolean;
    }) => {
      // Cancel any in-flight request to avoid race conditions
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setIsReplacing(replace);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (nextSearch.trim()) params.set("search", nextSearch.trim());
        if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
        params.set("page", String(nextPage));
        params.set("limit", String(LIMIT));

        const response = await fetch(`/api/episodes?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch episodes");

        const data: PayloadListResponse<Episode> = await response.json();

        setDocs(current => (replace ? data.docs : [...current, ...data.docs]));
        setPage(data.page);
        setHasNextPage(data.hasNextPage);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Could not load episodes. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsReplacing(false);
        }
      }
    },
    []
  );

  // Initial fetch when rendering client-side only (dev mode)
  useEffect(() => {
    if (!fetchOnMount) return;
    void fetchPage({
      nextSearch: initialSearch,
      nextSort: initialSort,
      nextPage: 1,
      replace: true,
    });
  }, [fetchOnMount, fetchPage, initialSearch, initialSort]);

  // Listen for filter changes + browser back/forward
  useEffect(() => {
    function onFiltersChange(event: Event) {
      const { search: nextSearch = "", sort: nextSort = "newest" } = (
        event as CustomEvent<FiltersChangeDetail>
      ).detail;
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
      const nextSort = params.get("sort") ?? "newest";
      setSearch(nextSearch);
      setSort(nextSort);
      setPage(1);
      setHasNextPage(false);
      void fetchPage({ nextSearch, nextSort, nextPage: 1, replace: true });
    }

    window.addEventListener("episodes:filters-change", onFiltersChange);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("episodes:filters-change", onFiltersChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, [fetchPage]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
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
  }, [hasNextPage, isLoading, page, search, sort, fetchPage]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return (
    <>
      {isReplacing && (
        <div className="flex flex-col gap-18 lg:gap-10" aria-hidden="true">
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
        <div className="flex flex-col gap-18 lg:gap-10">
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
