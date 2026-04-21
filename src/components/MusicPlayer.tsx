import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-[#121217] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-magenta-500/10 blur-[80px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 relative z-10">
        {/* Track Art */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-white/5 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <img 
              src={currentTrack.coverArt} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {isPlaying && (
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-white/40 text-sm truncate uppercase tracking-widest flex items-center gap-2">
            <Music2 size={12} className="text-cyan-500" />
            {currentTrack.artist}
          </p>

          {/* Visualizer bars dummy */}
          <div className="flex items-end gap-1 h-8 mt-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [8, Math.random() * 24 + 8, 8] } : { height: 8 }}
                transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                className="w-1.5 bg-gradient-to-t from-cyan-500 to-magenta-500 rounded-full opacity-60"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 space-y-4 relative z-10">
        {/* Progress */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer group/progress">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500 relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </motion.div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/30 tracking-tighter">
             <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
             <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
           <Volume2 size={18} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
           
           <div className="flex items-center gap-6">
              <button 
                onClick={prevTrack}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={24} />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={28} className="text-black" fill="black" /> : <Play size={28} className="text-black ml-1" fill="black" />}
              </button>

              <button 
                onClick={nextTrack}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Next track"
              >
                <SkipForward size={24} />
              </button>
           </div>

           <div className="flex items-center gap-1.5 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-magenta-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Live</span>
           </div>
        </div>
      </div>
    </div>
  );
}
