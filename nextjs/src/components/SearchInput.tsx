'use client';

import { useState, useEffect, useRef } from 'react';
import { debounce } from '@/lib/debounce';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  'aria-label'?: string;
}

const SearchInput = ({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '',
  debounceMs = 300,
  'aria-label': ariaLabel = 'Search'
}: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create debounced search function
  const debouncedSearch = useRef(
    debounce((searchQuery: unknown) => {
      if (onSearch && typeof searchQuery === 'string') {
        onSearch(searchQuery);
      }
      setIsSearching(false);
    }, debounceMs)
  ).current;

  useEffect(() => {
    setIsSearching(true);
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="pl-12 pr-4 h-12 text-base backdrop-blur-md border-primary/20 bg-background/50 focus:border-primary/40 focus:ring-primary/20 transition-all duration-200"
          aria-describedby={isSearching ? 'search-status' : undefined}
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Loading Indicator */}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary focus:outline-none focus:text-primary transition-colors duration-200 interactive"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Status for Screen Readers */}
      {isSearching && (
        <div id="search-status" className="sr-only" aria-live="polite">
          Searching...
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="mt-2 text-xs text-muted-foreground">
        Press <kbd className="px-1 py-0.5 bg-muted/50 border border-primary/20 rounded text-xs backdrop-blur-sm">Esc</kbd> to clear
      </div>
    </div>
  );
};

export { SearchInput };
