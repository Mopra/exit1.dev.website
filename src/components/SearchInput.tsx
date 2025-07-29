import { useState, useEffect, useRef } from 'react';
import { debounce } from '../utils/debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
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
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
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
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
          aria-describedby={isSearching ? 'search-status' : undefined}
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
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
      <div className="mt-2 text-xs text-gray-500">
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> to clear
      </div>
    </div>
  );
};

export default SearchInput; 