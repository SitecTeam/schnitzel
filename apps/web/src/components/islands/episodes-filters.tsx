import { useRef } from "react";
import { Search } from "lucide-react";

interface EpisodesFiltersProps {
  initialSearch?: string;
  initialSort?: string;
}

const SORT_OPTIONS = [
  { value: "-episodeNumber", label: "Newest First" },
  { value: "episodeNumber", label: "Oldest First" },
  { value: "guestName", label: "Guest Name (A-Z)" },
  { value: "-publishedAt", label: "Recently Published" },
];

export default function EpisodesFilters({
  initialSearch = "",
  initialSort = "-episodeNumber",
}: EpisodesFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  function navigate(search: string, sort: string) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (sort && sort !== "-episodeNumber") params.set("sort", sort);
    const qs = params.toString();
    window.location.href = qs ? `/episodes?${qs}` : "/episodes";
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const currentSearch = searchRef.current?.value ?? initialSearch;
    navigate(currentSearch, e.target.value);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      navigate(e.currentTarget.value, getSelectedSort());
    }
  }

  function handleSearchBlur(e: React.FocusEvent<HTMLInputElement>) {
    // Only navigate on blur if value actually changed
    if (e.target.value !== initialSearch) {
      navigate(e.target.value, getSelectedSort());
    }
  }

  function getSelectedSort(): string {
    const select =
      document.querySelector<HTMLSelectElement>("[data-sort-select]");
    return select?.value ?? initialSort;
  }

  // button-regular = Inter 16px bold — matches textVariants["button-regular"]
  const btnCls =
    "font-inter text-[16px] leading-[27px] font-bold text-secondary";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search input */}
      <div className="relative flex min-w-48 flex-1 items-center sm:flex-none">
        <input
          ref={searchRef}
          type="text"
          defaultValue={initialSearch}
          placeholder="Search Episodes"
          onKeyDown={handleSearchKeyDown}
          onBlur={handleSearchBlur}
          className={`h-9 w-full rounded-none border border-secondary bg-transparent px-3 pr-8 placeholder:text-secondary/50 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none sm:w-48 lg:w-56 ${btnCls}`}
        />
        <Search className="absolute right-2.5 h-4 w-4 text-secondary" />
      </div>

      {/* Sort select */}
      <div className="flex items-center gap-2">
        <span className={btnCls}>Sort by:</span>
        <select
          data-sort-select
          defaultValue={initialSort}
          onChange={handleSortChange}
          className={`h-9 rounded-none border-0 bg-transparent focus:ring-0 focus:outline-none ${btnCls}`}
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
