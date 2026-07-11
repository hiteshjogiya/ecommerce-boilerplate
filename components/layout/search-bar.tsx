'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRecentlySearched } from '@/features/products/hooks/use-recently-searched';

interface Suggestion {
  id: string;
  title: string;
  slug: string;
  category?: string;
}

export function SearchBar() {
  const router = useRouter();
  const { searches, addSearch, removeSearch, clearAll } = useRecentlySearched();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fetching, setFetching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setFetching(true);
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch {
      setSuggestions([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    addSearch(q.trim());
    setOpen(false);
    setQuery('');
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  const items = query.length >= 2 ? suggestions : [];
  const showRecent = open && query.length < 2 && searches.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const listLength = items.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, listLength - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex]) {
        router.push(`/products/${items[activeIndex].slug}`, { scroll: true });
        setOpen(false);
        setQuery('');
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search className="h-4 w-4 shrink-0" />
        <input
          ref={inputRef}
          id="search-input"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-sm"
          aria-label="Search products"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="search-listbox"
          aria-activedescendant={activeIndex >= 0 && items[activeIndex] ? `search-option-${items[activeIndex].id}` : undefined}
          role="combobox"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }} aria-label="Clear search">
            <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {open && (items.length > 0 || showRecent) && (
        <div
          id="search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden"
        >
          {/* Recent searches */}
          {showRecent && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recent Searches</span>
                <button onClick={clearAll} className="text-xs text-blue-600 hover:text-blue-800">Clear all</button>
              </div>
              {searches.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer group">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <button className="flex-1 text-left text-sm text-slate-700" onClick={() => handleSearch(s)}>{s}</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSearch(s); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${s} from recent searches`}
                  >
                    <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {items.length > 0 && (
            <div>
              {fetching && <div className="px-4 py-2 text-xs text-slate-400">Loading...</div>}
              {items.map((s, i) => (
                <button
                  key={s.id}
                  id={`search-option-${s.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => { router.push(`/products/${s.slug}`, { scroll: true }); addSearch(s.title); setOpen(false); setQuery(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === activeIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <TrendingUp className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 truncate">{highlightMatch(s.title, query)}</p>
                    {s.category && <p className="text-xs text-slate-400 truncate">{s.category}</p>}
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSearch(query)}
                className="w-full px-4 py-2.5 text-left text-sm text-blue-600 font-medium hover:bg-blue-50 border-t border-slate-100"
              >
                Search for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
