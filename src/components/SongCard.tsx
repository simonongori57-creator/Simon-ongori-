import { Download, Play, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Song } from "../types";
import React, { useState } from "react";

interface SongCardProps {
  key?: string;
  song: Song;
  onPlay: (song: Song) => void;
  isDownloaded: boolean;
  onDownload: (song: Song) => void;
}

export default function SongCard({ song, onPlay, isDownloaded, onDownload }: SongCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (isDownloaded || isDownloading) return;
    setIsDownloading(true);
    // Simulate high-fidelity download
    setTimeout(() => {
      setIsDownloading(false);
      onDownload(song);
    }, 2000);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative glass p-4 music-card-hover"
      id={`song-${song.id}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-indigo-950/20">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlay(song)}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40"
            id={`play-btn-${song.id}`}
          >
            <Play fill="currentColor" size={20} />
          </motion.button>
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-bold tracking-[0.1em] uppercase text-indigo-300">
          {song.region}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold truncate text-white text-sm tracking-tight">{song.title}</h3>
        <p className="text-xs text-gray-500 truncate">{song.artist}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-600 font-medium uppercase tracking-widest">{song.genre ? `${song.genre} • HQ` : 'HQ-FLAC'}</span>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${
            isDownloaded 
              ? "text-indigo-400" 
              : isDownloading 
                ? "text-white/20 animate-pulse" 
                : "text-indigo-400/60 hover:text-indigo-400 hover:scale-110"
          }`}
          id={`download-btn-${song.id}`}
        >
          {isDownloaded ? (
            <CheckCircle2 size={16} />
          ) : isDownloading ? (
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={18} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
