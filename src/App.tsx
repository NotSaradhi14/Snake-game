/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music, Gamepad2, Info } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/10 to-transparent opacity-50" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-magenta-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-cyan-600/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Navigation / Header */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-magenta-500 rounded-lg flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center text-cyan-400">
               <Gamepad2 size={24} className="animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
            Beat<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">Snake</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
           <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
             <Music size={14} /> Playlists
           </a>
           <a href="#" className="hover:text-magenta-400 transition-colors flex items-center gap-2">
             <Info size={14} /> Credits
           </a>
           <a href="#" className="hover:text-white transition-colors">
             v1.0.4-rc
           </a>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right flex flex-col">
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">High Score</span>
              <span className="text-xl font-bold text-cyan-400 tabular-nums">{highScore.toString().padStart(4, '0')}</span>
           </div>
           <div className="w-px h-6 bg-white/10" />
           <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Github size={20} className="text-white/40" />
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        
        {/* Game Section */}
        <section className="flex flex-col items-center">
          <div className="mb-8 text-center">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl lg:text-7xl font-black uppercase tracking-tighter italic mb-4"
            >
              Master the <br/><span className="text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]">Rhythm</span>
            </motion.h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm lg:text-base leading-relaxed font-light">
              Survive the digital grid as the tempo rises. Collect fragments to grow, but don't crash into the void.
            </p>
          </div>

          <SnakeGame onScoreChange={handleScoreChange} />

          {/* Key Hints */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl">
             {[
               { key: 'Arrows', action: 'Navigate' },
               { key: 'Space', action: 'Pause' },
               { key: 'Esc', action: 'Quit' },
               { key: 'M', action: 'Mute' },
             ].map((hint) => (
               <div key={hint.key} className="flex flex-col items-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{hint.action}</span>
                  <span className="px-3 py-1 rounded bg-white/10 border border-white/10 text-xs font-mono">{hint.key}</span>
               </div>
             ))}
          </div>
        </section>

        {/* Sidebar / Music Player Section */}
        <aside className="lg:sticky lg:top-12 flex flex-col gap-8">
           <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs uppercase tracking-[0.3em] font-mono text-white/30">System Audio</h3>
                <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i*150}ms` }} />)}
                </div>
              </div>
              <MusicPlayer />
           </section>

           <section className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
             <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-white/50 mb-6 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-yellow-500" />
               Global Leaderboard
             </h3>
             <div className="space-y-4">
                {[
                  { name: 'X-Cyber', score: 1450, rank: '01' },
                  { name: 'VoidRunner', score: 1220, rank: '02' },
                  { name: 'NeonGhost', score: 980, rank: '03' },
                ].map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-white/20">{entry.rank}</span>
                      <span className="text-sm font-medium group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{entry.name}</span>
                    </div>
                    <span className="text-xs font-mono text-white/40 tabular-nums">{entry.score}</span>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-2 border border-white/10 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all">
                View Full Table
             </button>
           </section>

           {/* Performance Monitor Dummy */}
           <div className="flex justify-between items-center px-2">
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] uppercase tracking-widest text-white/20">Latency</span>
                 <span className="text-[10px] font-mono text-green-500">14ms</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                 <span className="text-[9px] uppercase tracking-widest text-white/20">Memory</span>
                 <span className="text-[10px] font-mono text-white/60">42.4 MB</span>
              </div>
           </div>
        </aside>
      </main>

      <footer className="mt-24 py-12 border-t border-white/5 flex flex-col items-center gap-4 text-white/20">
         <p className="text-[10px] uppercase tracking-[0.4em]">Designed for high-latency survivors</p>
         <div className="flex gap-6 uppercase text-[9px] tracking-widest font-mono">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Terms</a>
           <a href="#" className="hover:text-white transition-colors">Support</a>
         </div>
      </footer>
    </div>
  );
}

