import React, { useState, useEffect, useCallback } from 'react';
import { createBoard, revealCell, toggleFlag, Board, GameStatus, DIFFICULTIES, Difficulty } from './utils/gameLogic';
import { Cell } from './components/Cell';
import { GameHeader } from './components/GameHeader';
import { Flag, MousePointer2, Cpu, Zap } from 'lucide-react';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES.BEGINNER);
  const [board, setBoard] = useState<Board>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timer, setTimer] = useState(0);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false); // For mobile/touch users

  // Initialize board on mount or difficulty change
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const resetGame = () => {
    // Create a dummy board first (visual only) - real board created on first click for safety
    const emptyBoard = createBoard(difficulty.rows, difficulty.cols, 0); 
    setBoard(emptyBoard);
    setStatus('idle');
    setTimer(0);
    setFlagsUsed(0);
  };

  const handleCellClick = (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    // Handle Flag Mode (for mobile mainly)
    if (isFlagMode) {
      handleContextMenu(null, row, col);
      return;
    }

    if (status === 'idle') {
      // First click: generate safe board
      const newBoard = createBoard(difficulty.rows, difficulty.cols, difficulty.mines, { row, col });
      const result = revealCell(newBoard, row, col);
      setBoard(result.board);
      setStatus('playing');
    } else {
      const result = revealCell(board, row, col);
      setBoard(result.board);
      if (result.status !== 'playing') {
        setStatus(result.status);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent | null, row: number, col: number) => {
    if (e) e.preventDefault();
    if (status === 'won' || status === 'lost') return;

    if (status === 'idle') return;

    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
    
    // Update flag count
    const flags = newBoard.flat().filter(c => c.isFlagged).length;
    setFlagsUsed(flags);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col items-center py-8 px-4 font-rajdhani select-none relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(0,240,255,0.05),_transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        
        {/* Rotating HUD Circles */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full border border-cyan-500/5 opacity-20 animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-[-300px] right-[-300px] w-[800px] h-[800px] rounded-full border border-cyan-500/5 opacity-20 animate-[spin_30s_linear_infinite_reverse]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-8">
          <Cpu className="text-cyan-400 w-8 h-8 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 font-orbitron tracking-widest drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            J.A.R.V.I.S. <span className="text-xl sm:text-2xl text-cyan-500/50">MINESWEEPER</span>
          </h1>
        </div>

        {/* Difficulty Selector */}
        <div className="flex gap-4 mb-8 p-1 bg-cyan-950/30 rounded-full border border-cyan-500/20 backdrop-blur-sm">
          {Object.values(DIFFICULTIES).map((diff) => (
            <button
              key={diff.name}
              onClick={() => setDifficulty(diff)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
                difficulty.name === diff.name
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] border border-cyan-400/50'
                  : 'text-cyan-700 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              {diff.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Game Container */}
        <div className="relative bg-black/40 p-1 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.05)]">
          {/* Corner Accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          <GameHeader 
            minesLeft={difficulty.mines - flagsUsed}
            timer={timer}
            status={status}
            onReset={resetGame}
          />

          {/* Board */}
          <div 
            className="mt-1 bg-black/60 border-t border-cyan-500/20 overflow-auto max-w-[95vw] max-h-[70vh] p-4 custom-scrollbar"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${difficulty.cols}, min-content)`,
              gap: '2px',
            }}
          >
            {board.map((row, rIndex) => (
              row.map((cell, cIndex) => (
                <Cell
                  key={`${rIndex}-${cIndex}`}
                  cell={cell}
                  onClick={handleCellClick}
                  onContextMenu={handleContextMenu}
                />
              ))
            ))}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="mt-8 flex items-center gap-4 sm:hidden">
          <div className="flex bg-cyan-950/40 rounded-lg border border-cyan-500/30 p-1 backdrop-blur-sm">
            <button
              onClick={() => setIsFlagMode(false)}
              className={`p-4 rounded-md transition-all flex items-center gap-2 ${
                !isFlagMode 
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                  : 'text-cyan-700'
              }`}
            >
              <Zap size={20} />
              <span className="text-xs font-bold font-orbitron">TARGET</span>
            </button>
            <button
              onClick={() => setIsFlagMode(true)}
              className={`p-4 rounded-md transition-all flex items-center gap-2 ${
                isFlagMode 
                  ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(255,170,0,0.2)]' 
                  : 'text-cyan-700'
              }`}
            >
              <Flag size={20} />
              <span className="text-xs font-bold font-orbitron">MARK</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-cyan-500/60 text-xs font-rajdhani tracking-widest uppercase">
          <p className="mb-2">
            <span className="text-cyan-400 font-bold">System:</span> Left Click to Scan Sector
          </p>
          <p>
            <span className="text-orange-400 font-bold">Protocol:</span> Right Click to Mark Threat
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
