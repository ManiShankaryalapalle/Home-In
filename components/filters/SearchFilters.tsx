type SearchFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  sortOption: string;
  onSortOptionChange: (value: string) => void;
  budgetFilter: string;
  onBudgetFilterChange: (value: string) => void;
  bedroomFilter: string;
  onBedroomFilterChange: (value: string) => void;
  bathroomFilter: string;
  onBathroomFilterChange: (value: string) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (value: boolean) => void;
  underpricedOnly: boolean;
  onUnderpricedOnlyChange: (value: boolean) => void;
};

export function SearchTopBar({
  searchTerm,
  onSearchTermChange,
  sortOption,
  onSortOptionChange,
  budgetFilter,
  onBudgetFilterChange,
}: Pick<
  SearchFiltersProps,
  | "searchTerm"
  | "onSearchTermChange"
  | "sortOption"
  | "onSortOptionChange"
  | "budgetFilter"
  | "onBudgetFilterChange"
>) {
  return (
    <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
      <input
        type="text"
        placeholder="Search by city, neighborhood, or keyword"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 md:col-span-2"
      />

      <select
        value={budgetFilter}
        onChange={(e) => onBudgetFilterChange(e.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
      >
        <option value="any">Any Budget</option>
        <option value="under-1300">Under $1300</option>
        <option value="1300-1700">$1300 - $1700</option>
        <option value="1700-plus">$1700+</option>
      </select>

      <select
        value={sortOption}
        onChange={(e) => onSortOptionChange(e.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
      >
        <option value="best-match">Best Match</option>
        <option value="low-price">Lowest Price</option>
        <option value="high-price">Highest Price</option>
      </select>
    </div>
  );
}

export function SearchSidebar({
  bedroomFilter,
  onBedroomFilterChange,
  bathroomFilter,
  onBathroomFilterChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  underpricedOnly,
  onUnderpricedOnlyChange,
}: Pick<
  SearchFiltersProps,
  | "bedroomFilter"
  | "onBedroomFilterChange"
  | "bathroomFilter"
  | "onBathroomFilterChange"
  | "verifiedOnly"
  | "onVerifiedOnlyChange"
  | "underpricedOnly"
  | "onUnderpricedOnlyChange"
>) {
  return (
    <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold">Filters</h2>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm text-slate-400">Bedrooms</label>
          <select
            value={bedroomFilter}
            onChange={(e) => onBedroomFilterChange(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="any">Any</option>
            <option value="studio">Studio</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3+">3+ Bedrooms</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">Bathrooms</label>
          <select
            value={bathroomFilter}
            onChange={(e) => onBathroomFilterChange(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="any">Any</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
            <option value="3+">3+ Bathrooms</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Listing Status
          </label>
          <div className="space-y-3 text-sm text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              />
              Verified only
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={underpricedOnly}
                onChange={(e) => onUnderpricedOnlyChange(e.target.checked)}
              />
              Underpriced only
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}