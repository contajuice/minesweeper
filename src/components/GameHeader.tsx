
import React from 'react';
import { Activity, AlertTriangle, RefreshCw, ShieldCheck, ShieldAlert, Timer } from 'lucide-react';
import { GameStatus } from '../utils/gameLogic';

interface GameHeaderProps {
  minesLeft: number;
  timer: number;
  status: GameStatus;
  onReset: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ minesLeft, timer, status, onReset }) => {
  return (
    <div className="flex items-center justify-between bg-black/40 backdrop-blur-sm p-4 rounded-t-lg border-b border-cyan-500/30 w-full max-w-4xl mx-auto relative overflow-hidden">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Mine Counter */}
      <div className="flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-widest text-cyan-500/70 mb-1 font-orbitron">Threats</div>
        <div className="bg-black/60 text-red-500 font-orbitron text-2xl sm:text-3xl px-4 py-2 rounded border border-red-900/50 shadow-[0_0_10px_rgba(255,0,0,0.2)] min-w-[100px] text-center relative">
          <span className="text-red-500/20 absolute left-0 top-0 w-full h-full flex items-center justify-center select-none">888</span>
          <span className="relative z-10 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
            {Math.max(0, minesLeft).toString().padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Status / Reset */}
      <button
        onClick={onReset}
        className="group relative w-16 h-16 flex items-center justify-center"
      >
        {/* Rotating Rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-t-cyan-400 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/20 border-b-cyan-400 animate-[spin_2s_linear_infinite_reverse]" />
        
        {/* Center Icon */}
        <div className="relative z-10 transition-transform group-hover:scale-110">
          {status === 'won' ? (
            <ShieldCheck className="w-8 h-8 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          ) : status === 'lost' ? (
            <ShieldAlert className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          ) : (
            <Activity className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          )}
        </div>
      </button>

      {/* Timer */}
      <div className="flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-widest text-cyan-500/70 mb-1 font-orbitron">Duration</div>
        <div className="bg-black/60 text-cyan-400 font-orbitron text-2xl sm:text-3xl px-4 py-2 rounded border border-cyan-900/50 shadow-[0_0_10px_rgba(0,240,255,0.2)] min-w-[100px] text-center relative">
          <span className="text-cyan-500/20 absolute left-0 top-0 w-full h-full flex items-center justify-center select-none">888</span>
          <span className="relative z-10 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
            {Math.min(999, timer).toString().padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};
