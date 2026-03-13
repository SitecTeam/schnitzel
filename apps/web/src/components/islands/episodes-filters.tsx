import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
interface EpisodesFiltersProps {
  initialSearch?: string;
  initialSort?: string;
}

const SORT_OPTIONS = [
  { value: "-episodeNumber", label: "Newest First" },
  { value: "episodeNumber", label: "Oldest First" },
  { value: "-publishedAt", label: "Recently Published" },
];

const SEARCH_DEBOUNCE_MS = 500;

export default function EpisodesFilters({
  initialSearch = "",
  initialSort = "-episodeNumber",
}: EpisodesFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch.trim());

  function navigate(search: string, sort: string) {
    const trimmedSearch = search.trim();
    const params = new URLSearchParams();
    if (trimmedSearch) params.set("search", trimmedSearch);
    if (sort && sort !== "-episodeNumber") params.set("sort", sort);
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

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(searchValue, e.target.value);
  }

  useEffect(() => {
    const trimmedSearch = searchValue.trim();
    if (trimmedSearch === appliedSearch) return;

    const timer = window.setTimeout(() => {
      navigate(searchValue, getSelectedSort());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchValue, appliedSearch]);

  function handleClearSearch() {
    if (!searchValue) return;
    setSearchValue("");
    navigate("", getSelectedSort());
    searchRef.current?.focus();
  }

  function getSelectedSort(): string {
    const select =
      document.querySelector<HTMLSelectElement>("[data-sort-select]");
    return select?.value ?? initialSort;
  }

  const btnCls =
    "font-inter text-[16px] leading-[27px] font-bold text-secondary";

  return (
    <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center lg:flex-1 lg:justify-end">
      <div className="relative flex min-w-0 flex-1 items-center lg:max-w-87.5">
        <Input
          ref={searchRef}
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search Episodes"
          className={cn(
            "min-h-12.5 w-full rounded-none border-2 border-[#7492B2] bg-transparent px-3 pr-8 placeholder:text-[#7492B2] focus:border-[#7492B2] focus:ring-0 focus:ring-[#7492B2] focus:outline-none",
            btnCls
          )}
        />
        {searchValue ? (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 text-[#7492B2]"
          >
            <X className="size-5" />
          </button>
        ) : (
          <Search className="pointer-events-none absolute right-2.5 size-5 text-[#7492B2]" />
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <span className={btnCls}>Sort by:</span>
        <select
          data-sort-select
          defaultValue={initialSort}
          onChange={handleSortChange}
          className={cn(
            "h-9 rounded-none border-0 bg-transparent focus:ring-0 focus:outline-none",
            btnCls
          )}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
