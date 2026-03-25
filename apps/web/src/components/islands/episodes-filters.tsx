import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Search,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CustomTooltip } from "./custom-tooltip";
interface EpisodesFiltersProps {
  initialSearch?: string;
  initialSort?: string;
}

const SORT_OLDEST = "oldest";

const SEARCH_DEBOUNCE_MS = 500;

export default function EpisodesFilters({
  initialSearch = "",
  initialSort = "newest",
}: EpisodesFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch.trim());
  const [sortValue, setSortValue] = useState(
    initialSort === SORT_OLDEST ? SORT_OLDEST : "newest"
  );

  function navigate(search: string, sort: string) {
    const trimmedSearch = search.trim();
    const params = new URLSearchParams();
    if (trimmedSearch) params.set("search", trimmedSearch);
    if (sort && sort !== "newest") params.set("sort", sort);
    const slug = params.toString();
    const nextPath = slug ? `/episodes?${slug}` : "/episodes";
    window.history.replaceState({}, "", nextPath);
    setAppliedSearch(trimmedSearch);

    window.dispatchEvent(
      new CustomEvent("episodes:filters-change", {
        detail: {
          search: trimmedSearch,
          sort,
        },
      })
    );
  }

  function handleSortToggle() {
    const nextSort = sortValue === "newest" ? SORT_OLDEST : "newest";
    setSortValue(nextSort);
    navigate(searchValue, nextSort);
  }

  useEffect(() => {
    const trimmedSearch = searchValue.trim();
    if (trimmedSearch === appliedSearch) return;

    const timer = window.setTimeout(() => {
      navigate(searchValue, sortValue);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchValue, appliedSearch, sortValue]);

  function handleClearSearch() {
    if (!searchValue) return;
    setSearchValue("");
    navigate("", sortValue);
    searchRef.current?.focus();
  }

  const btnCls =
    "font-inter text-[16px] leading-[27px] font-bold text-[#7492B2]";

  return (
    <div className="flex w-full min-w-0 justify-center gap-4 sm:items-center">
      <div className="relative flex w-full min-w-0 flex-1 items-center xl:ml-20 xl:max-w-180">
        <Input
          ref={searchRef}
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search Episodes"
          className={cn(
            "min-h-12.5 w-full rounded-none border-2 border-[#7492B2] bg-transparent px-3 pr-11 selection:bg-[#7493B2] placeholder:text-[#7492B2]/80 focus:border-[#7492B2] focus:ring-0 focus:ring-[#7492B2] focus:outline-none",
            btnCls
          )}
        />
        {searchValue ? (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-5 cursor-pointer text-[#7492B2]"
          >
            <X className="size-5" />
          </button>
        ) : (
          <Search className="pointer-events-none absolute right-5 size-5 text-[#7492B2]" />
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <CustomTooltip text="Change date order">
          <Button
            type="button"
            onClick={handleSortToggle}
            className="h-12.5 cursor-pointer justify-start border-2 border-[#7492B2] bg-transparent p-3 text-[#7492B2] hover:bg-transparent hover:text-[#7492B2] sm:min-w-41.5 sm:px-4 sm:py-3 xl:h-12.5 xl:px-4 xl:py-3"
          >
            <span
              className={cn("hidden min-w-0 sm:flex sm:min-w-26.25", btnCls)}
            >
              <span>Date:&nbsp;</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={sortValue}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className="inline-flex"
                >
                  {sortValue === "newest" ? "Newest" : "Oldest"}
                </motion.span>
              </AnimatePresence>
            </span>

            <span className="relative inline-flex size-6 items-center justify-center sm:size-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`icon-${sortValue}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className="absolute inset-0 inline-flex items-center justify-center"
                >
                  {sortValue === "newest" ? (
                    <ArrowDownWideNarrow className="size-6 sm:size-5" />
                  ) : (
                    <ArrowUpNarrowWide className="size-6 sm:size-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
          </Button>
        </CustomTooltip>
      </div>
    </div>
  );
}
