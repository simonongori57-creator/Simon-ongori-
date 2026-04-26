import { Search, Globe2 } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export default function SearchHero({ onSearch, isSearching }: SearchHeroProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="relative p-10 overflow-hidden glass h-72 flex flex-col justify-end group">
      <div className="absolute top-0 right-0 p-8 text-9xl font-black text-white/5 select-none tracking-tighter opacity-10 group-hover:opacity-20 transition-opacity">
        SONIC
      </div>
      
      <div className="relative z-10 max-w-2xl space-y-6">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-3 block glow-text">Featured Interface</span>
          <h2 className="text-5xl font-bold text-white mb-4 font-serif italic tracking-tight">Midnight Rhythm</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Directly download high-fidelity FLAC or MP3 versions of global hits from the world's most evocative underground scenes.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="relative max-w-lg mt-8 group/input"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-indigo-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artist, song, or country..."
            className="w-full h-12 pl-14 pr-24 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            id="main-search-input"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-1.5 bottom-1.5 px-6 bg-white text-black hover:bg-indigo-400 hover:text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            id="search-submit-btn"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
    </div>
  );
}
