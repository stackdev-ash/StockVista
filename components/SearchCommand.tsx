"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import WatchlistButton from "./WatchlistButton";

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  useEffect(() => {
    const loadPopularStocks = async () => {
      if (!open || stocks.length > 0) return;

      setLoading(true);

      try {
        const results = await searchStocks();
        setStocks(results);
      } finally {
        setLoading(false);
      }
    };

    loadPopularStocks();
  }, [open, stocks.length]);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  // Handle watchlist changes status change
  const handleWatchlistChange = async (symbol: string, isAdded: boolean) => {
    // Update current stocks
    setStocks((prev) =>
      prev.map((stock) =>
        stock.symbol === symbol ? { ...stock, isInWatchlist: isAdded } : stock,
      ),
    );
  };

  return (
    <>
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-base h-10 font-semibold rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all duration-200"
        >
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog scrollbar-hide-default"
        showCloseButton
      >
        <div className="search-field">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found" : "No stocks available"}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                <li key={`${stock.symbol}-${i}`} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-white">{stock.name}</div>

                      <div className="text-xs text-gray-400 mt-1">
                        {stock.symbol} • {stock.type}
                      </div>
                    </div>
                    <WatchlistButton
                      symbol={stock.symbol}
                      company={stock.name}
                      isInWatchlist={stock.isInWatchlist}
                      type="icon"
                      onWatchlistChange={handleWatchlistChange}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
