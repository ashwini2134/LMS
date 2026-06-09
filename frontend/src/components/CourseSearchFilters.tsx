import { useState, useEffect } from "react";
import { Search, X, RotateCcw, Flame } from "lucide-react";
import type { Course } from "../api";

interface CourseSearchFiltersProps {
  courses: Course[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onFilteredCoursesChange: (filtered: Course[]) => void;
}

export function CourseSearchFilters({ courses, searchQuery, setSearchQuery, onFilteredCoursesChange }: CourseSearchFiltersProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fa_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Filter courses whenever search query or filters change
  useEffect(() => {
    let filtered = [...courses];

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    // Level Filter
    if (selectedLevel !== "All") {
      filtered = filtered.filter((c) => c.level === selectedLevel);
    }

    // Category Filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    onFilteredCoursesChange(filtered);
  }, [searchQuery, selectedLevel, selectedCategory, courses, onFilteredCoursesChange]);

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const term = query.trim();
    let updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())];
    updated = updated.slice(0, 5); // Keep last 5 searches
    setRecentSearches(updated);
    localStorage.setItem("fa_recent_searches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("fa_recent_searches");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecentSearch(searchQuery);
  };

  const handlePopularClick = (tag: string) => {
    setSearchQuery(tag);
    addRecentSearch(tag);
  };

  const handleRecentClick = (term: string) => {
    setSearchQuery(term);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All");
    setSelectedCategory("All");
  };

  // Unique categories and levels from input courses
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const categories = ["All", "Programming", "Computer Science", "Artificial Intelligence"];
  const popularSearches = ["Python", "AI", "Beginner", "Computer Science"];

  return (
    <div className="w-full bg-[#0c101b]/50 border border-slate-800/60 rounded-3xl p-5 md:p-6 backdrop-blur-md mb-6">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-4">
        <Search className="absolute left-4 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => searchQuery.trim() && addRecentSearch(searchQuery)}
          placeholder="Search courses by name or description..."
          className="w-full pl-12 pr-10 py-3 bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none rounded-2xl text-sm text-slate-100 placeholder-slate-500 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 p-1 rounded-full text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Grid of Search Metadata and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Recent and Popular searches */}
        <div className="space-y-3">
          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Popular:
            </span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handlePopularClick(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Recent:
              </span>
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRecentClick(term)}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  {term}
                </button>
              ))}
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[10px] text-slate-500 hover:text-red-400 font-semibold underline ml-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Level & Category Filters */}
        <div className="flex flex-wrap gap-4 md:justify-end items-center">
          {/* Level Filter */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Difficulty Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-[#0b0f19]">
                  {lvl === "All" ? "All Levels" : lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Topic / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0b0f19]">
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchQuery || selectedLevel !== "All" || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="md:mt-5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Custom Empty Results Component ───────────────────────────────────────────
interface NoResultsStateProps {
  query: string;
  onSelectSuggestion: (tag: string) => void;
}

export function NoResultsState({ query, onSelectSuggestion }: NoResultsStateProps) {
  const suggestions = ["Python", "AI", "Beginner", "Computer Science"];
  return (
    <div className="text-center py-12 px-6 bg-[#0c101b]/30 border border-slate-800/50 rounded-3xl max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-slate-800/40 flex items-center justify-center mx-auto mb-4 border border-slate-700/30">
        <Search className="w-6 h-6 text-slate-500 animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">No courses found</h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        We couldn't find any courses matching <span className="text-blue-400 font-semibold">"{query}"</span>. 
        Try checking for spelling errors, clearing filters, or choosing one of our popular topics below:
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelectSuggestion(s)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
