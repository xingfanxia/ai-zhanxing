"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface CityResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  displayName: string;
  source: "static" | "nominatim";
}

interface CitySearchProps {
  value?: string;
  onSelect: (city: CityResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CitySearch({
  value = "",
  onSelect,
  placeholder = "Search for a city...",
  className = "",
  disabled = false,
}: CitySearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CityResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(searchQuery)}&limit=8`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.data?.cities || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("City search error:", err);
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the search
    debounceRef.current = setTimeout(() => {
      searchCities(newQuery);
    }, 300);
  };

  // Handle city selection
  const handleSelect = (city: CityResult) => {
    setQuery(city.displayName);
    setIsOpen(false);
    setResults([]);
    onSelect(city);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Clear input
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
        {/* Loading or clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}

      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
          >
            <ul className="max-h-64 overflow-y-auto">
              {results.map((city, index) => (
                <li key={`${city.name}-${city.country}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-purple-500/20"
                        : "hover:bg-slate-700/50"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 font-medium truncate">
                        {city.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {city.country}
                        {city.timezone && (
                          <span className="ml-2 text-slate-500">
                            ({city.timezone})
                          </span>
                        )}
                      </p>
                    </div>
                    {city.source === "static" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        Quick
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Hint about more cities */}
            <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Type more to search worldwide cities
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
          >
            <p className="text-sm text-slate-400">
              No cities found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try a different spelling or enter coordinates manually
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { CityResult };
