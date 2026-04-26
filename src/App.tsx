/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Library, Download, Settings, Globe2, Compass, Mic2, Sparkles, TrendingUp, Music2 } from "lucide-react";
import SearchHero from "./components/SearchHero";
import SongCard from "./components/SongCard";
import MusicPlayer from "./components/MusicPlayer";
import { Song } from "./types";
import { getTrendingSongs, searchSongs, getPersonalizedRecommendations, browseByCategory } from "./services/musicService";

type AppView = "explore" | "library" | "recommendations" | "charts" | "category";

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [library, setLibrary] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<AppView>("explore");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    // Initial fetch
    getTrendingSongs().then(setSongs);
    
    // Load library
    const saved = localStorage.getItem("sonic_library");
    const savedLibrary = saved ? JSON.parse(saved) : [];
    setLibrary(savedLibrary);

    // Initial recommendations
    getPersonalizedRecommendations(savedLibrary).then(setRecommendations);
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setView("explore");
    const results = await searchSongs(query);
    setSongs(results);
    setIsSearching(false);
  };

  const handleCategoryBrowse = async (name: string, type: 'genre' | 'artist') => {
    setIsSearching(true);
    setCategoryName(name);
    setView("category");
    const results = await browseByCategory(name, type);
    setSongs(results);
    setIsSearching(false);
  };

  const handleDownload = (song: Song) => {
    if (library.some(s => s.id === song.id)) return;
    const newLibrary = [...library, song];
    setLibrary(newLibrary);
    localStorage.setItem("sonic_library", JSON.stringify(newLibrary));
    
    // Update recommendations on new download
    getPersonalizedRecommendations(newLibrary).then(setRecommendations);
  };

  const isDownloaded = (id: string) => library.some(s => s.id === id);

  return (
    <div className="flex min-h-screen bg-[#03040a] text-white p-6 gap-6">
      <div className="atmosphere" />
      
      {/* Sidebar */}
      <aside className="w-72 flex flex-col gap-6 sticky top-6 h-[calc(100vh-3rem)]">
        <div className="glass p-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe2 className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight glow-text text-white font-serif italic">SONICWORLD</h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.3em] font-medium">Global Discovery</p>
        </div>

        <div className="glass p-6 flex-1 flex flex-col overflow-hidden">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Navigation</h2>
          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            <SidebarLink active={view === "explore"} onClick={() => setView("explore")} icon={<Compass size={18} />} label="Explore Trends" />
            <SidebarLink active={view === "recommendations"} onClick={() => setView("recommendations")} icon={<Sparkles size={18} />} label="For You" />
            <SidebarLink active={view === "library"} onClick={() => setView("library")} icon={<Library size={18} />} label="My Library" />
            
            <div className="pt-6 pb-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Discovery</div>
            <SidebarLink active={view === "charts"} onClick={() => setView("charts")} icon={<TrendingUp size={18} />} label="Global Charts" />
            <SidebarLink icon={<Mic2 size={18} />} label="Artists Hub" />
            <SidebarLink icon={<Download size={18} />} label="All Downloads" badge={library.length} />
          </nav>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Platforms</h2>
            <div className="platform-pill"><div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> iOS & Android</div>
            <div className="platform-pill"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> macOS & PC</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <SearchHero onSearch={handleSearch} isSearching={isSearching} />
              
              <GenreBar onSelect={(g) => handleCategoryBrowse(g, 'genre')} />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold font-serif tracking-tight capitalize">
                    {isSearching ? "Searching the globe..." : "Trending Globally"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {songs.map(song => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      onPlay={(s) => setCurrentSong(s)}
                      isDownloaded={isDownloaded(song.id)}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>

              {recommendations.length > 0 && (
                <div className="space-y-6 pt-12">
                  <h2 className="text-2xl font-bold font-serif tracking-tight">AI Recommended for You</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-indigo-400">
                    {recommendations.slice(0, 4).map(song => (
                      <SongCard 
                        key={song.id} 
                        song={song} 
                        onPlay={(s) => setCurrentSong(s)}
                        isDownloaded={isDownloaded(song.id)}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === "recommendations" && (
             <motion.div
              key="recommendations"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="glass p-12 relative overflow-hidden">
                <Sparkles className="absolute -right-12 -top-12 w-64 h-64 text-indigo-500/10 opacity-20" />
                <h1 className="text-5xl font-serif font-black italic mb-4">Personalized Mix</h1>
                <p className="text-gray-400 max-w-xl">Curated specifically for you based on the {library.length} tracks in your library. Our AI explores global frequency to find your next obsession.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map(song => (
                  <SongCard key={song.id} song={song} onPlay={(s) => setCurrentSong(s)} isDownloaded={isDownloaded(song.id)} onDownload={handleDownload} />
                ))}
              </div>
            </motion.div>
          )}

          {view === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView("explore")} className="p-3 glass rounded-full hover:bg-indigo-500/20 text-indigo-400">
                  <Compass size={24} />
                </button>
                <h1 className="text-4xl font-serif font-black italic">{categoryName} Collection</h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {songs.map(song => (
                  <SongCard key={song.id} song={song} onPlay={(s) => setCurrentSong(s)} isDownloaded={isDownloaded(song.id)} onDownload={handleDownload} />
                ))}
              </div>
            </motion.div>
          )}

          {view === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h1 className="text-5xl font-serif font-black italic">My Library</h1>
                <p className="text-white/40">You have {library.length} tracks saved for offline use.</p>
              </div>

              {library.length === 0 ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                    <Library size={40} />
                  </div>
                  <h3 className="text-xl font-bold">Your library is empty</h3>
                  <p className="text-white/30 max-w-xs mx-auto">Found some tunes you love? Hit the download button to save them here.</p>
                  <button 
                    onClick={() => setView("explore")}
                    className="px-6 py-2 bg-indigo-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {library.map(song => (
                    <SongCard 
                      key={song.id} 
                      song={song} 
                      onPlay={(s) => setCurrentSong(s)}
                      isDownloaded={true}
                      onDownload={() => {}}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Music Player */}
      <MusicPlayer 
        currentSong={currentSong} 
        onNext={() => {}} 
        onPrev={() => {}} 
      />
    </div>
  );
}

function SidebarLink({ icon, label, active = false, badge, onClick }: { icon: React.ReactNode, label: string, active?: boolean, badge?: number, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
        active 
          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-indigo-400" : "text-gray-500 group-hover:text-indigo-400"} transition-colors`}>{icon}</span>
        <span className="text-sm font-medium tracking-tight">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-md font-bold glow-text">{badge}</span>
      )}
    </button>
  );
}

function GenreBar({ onSelect }: { onSelect: (genre: string) => void }) {
  const genres = ["Afrobeats", "K-Pop", "Latin Jazz", "Phonk", "Nordic Folk", "J-Rock", "Ammegiana", "Synthwave"];
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className="whitespace-nowrap px-6 py-2.5 glass text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all active:scale-95"
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
