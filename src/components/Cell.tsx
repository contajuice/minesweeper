
import React from 'react';
import { CellState } from '../utils/gameLogic';
import { Flag, Bomb, Hexagon } from 'lucide-react';

interface CellProps {
  cell: CellState;
  onClick: (row: number, col: number) => void;
  onContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
}

const NUMBER_COLORS = [
  '', // 0
  'text-cyan-400 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]', // 1
  'text-green-400 drop-shadow-[0_0_2px_rgba(74,222,128,0.8)]', // 2
  'text-red-400 drop-shadow-[0_0_2px_rgba(248,113,113,0.8)]', // 3
  'text-purple-400 drop-shadow-[0_0_2px_rgba(192,132,252,0.8)]', // 4
  'text-orange-400 drop-shadow-[0_0_2px_rgba(251,146,60,0.8)]', // 5
  'text-blue-400 drop-shadow-[0_0_2px_rgba(96,165,250,0.8)]', // 6
  'text-pink-400 drop-shadow-[0_0_2px_rgba(244,114,182,0.8)]', // 7
  'text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.8)]', // 8
];

export const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, cell.row, cell.col);
  };

  const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold select-none cursor-pointer transition-all duration-200 relative overflow-hidden";
  
  // Unrevealed state
  if (!cell.isRevealed) {
    return (
      <div
        className={`${baseClasses} border border-cyan-900/50 bg-cyan-950/20 hover:bg-cyan-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_8px_rgba(0,240,255,0.3)]`}
        onClick={() => onClick(cell.row, cell.col)}
        onContextMenu={handleContextMenu}
      >
        {/* Tech pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 to-transparent" />
        
        {cell.isFlagged && (
          <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500/20 drop-shadow-[0_0_5px_rgba(255,170,0,0.8)] animate-pulse" />
        )}
      </div>
    );
  }

  // Revealed Mine
  if (cell.isMine) {
    return (
      <div className={`${baseClasses} border border-red-500/50 bg-red-950/60 shadow-[inset_0_0_10px_rgba(255,0,0,0.5)]`}>
        <Bomb className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-900 animate-pulse drop-shadow-[0_0_8px_rgba(255,50,50,1)]" />
      </div>
    );
  }

  // Revealed Number
  return (
    <div
      className={`${baseClasses} border border-cyan-900/30 bg-black/40 font-orbitron ${NUMBER_COLORS[cell.neighborMines]}`}
      onContextMenu={handleContextMenu}
    >
      {cell.neighborMines > 0 ? cell.neighborMines : ''}
    </div>
  );
};
