import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Repeat, Shuffle, Maximize2, ListMusic, Heart 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Song } from "../types";
import React, { useState, useEffect } from "react";

interface MusicPlayerProps {
  currentSong: Song | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function MusicPlayer({ currentSong, onNext, onPrev }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
      setProgress(0);
      setIsLiked(false);
    }
  }, [currentSong]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-6 right-6 h-24 glass flex items-center px-8 gap-8 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5"
      id="music-player-bar"
    >
      {/* Song Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-xl border border-white/10">
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
        </div>
        <div className="truncate">
          <h4 className="font-bold truncate text-white text-sm tracking-tight">{currentSong.title}</h4>
          <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`hover:scale-110 transition-transform flex-shrink-0 ${isLiked ? "text-indigo-400" : "text-white/20 hover:text-white"}`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-3">
        <div className="flex items-center gap-8">
          <button className="text-gray-500 hover:text-white transition-colors"><Shuffle size={16} /></button>
          <button onClick={onPrev} className="text-white hover:text-indigo-400 transition-colors"><SkipBack size={22} fill="currentColor" /></button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={onNext} className="text-white hover:text-indigo-400 transition-colors"><SkipForward size={22} fill="currentColor" /></button>
          <button className="text-gray-500 hover:text-white transition-colors"><Repeat size={16} /></button>
        </div>
        
        <div className="w-full max-w-2xl flex items-center gap-4">
          <span className="text-[10px] font-mono text-gray-500 tabular-nums">1:24</span>
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden relative group cursor-pointer">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-indigo-500 glow-text" 
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-500 tabular-nums">{currentSong.duration}</span>
        </div>
      </div>

      {/* Volume & Misc */}
      <div className="flex items-center justify-end gap-6 w-1/4">
        <button className="text-gray-500 hover:text-white transition-colors"><ListMusic size={18} /></button>
        <div className="flex items-center gap-3 group w-32">
          <Volume2 size={18} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 w-2/3 group-hover:bg-indigo-400" />
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors"><Maximize2 size={16} /></button>
      </div>
    </motion.div>
  );
}
