
export type CellState = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type Board = CellState[][];

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Difficulty = {
  name: string;
  rows: number;
  cols: number;
  mines: number;
};

export const DIFFICULTIES: Record<string, Difficulty> = {
  BEGINNER: { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
  INTERMEDIATE: { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  EXPERT: { name: 'Expert', rows: 16, cols: 30, mines: 99 },
};

// Directions for neighbor checking (8 neighbors)
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function createBoard(rows: number, cols: number, mines: number, firstClick?: { row: number, col: number }): Board {
  let board: Board = [];

  // 1. Initialize empty board
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      };
    }
  }

  // 2. Place mines
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Don't place mine on existing mine
    if (board[r][c].isMine) continue;

    // Don't place mine on first click or its neighbors (safe start)
    if (firstClick) {
      const isFirstClick = r === firstClick.row && c === firstClick.col;
      const isNeighbor = Math.abs(r - firstClick.row) <= 1 && Math.abs(c - firstClick.col) <= 1;
      if (isFirstClick || isNeighbor) continue;
    }

    board[r][c].isMine = true;
    minesPlaced++;
  }

  // 3. Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;
      DIRECTIONS.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
          count++;
        }
      });
      board[r][c].neighborMines = count;
    }
  }

  return board;
}

export function revealCell(board: Board, row: number, col: number): { board: Board, status: GameStatus } {
  const newBoard = [...board.map(row => [...row])];
  const cell = newBoard[row][col];

  // Cannot reveal flagged or already revealed cells
  if (cell.isFlagged || cell.isRevealed) {
    return { board: newBoard, status: 'playing' };
  }

  // Hit a mine
  if (cell.isMine) {
    cell.isRevealed = true;
    // Reveal all other mines
    newBoard.forEach(r => r.forEach(c => {
      if (c.isMine) c.isRevealed = true;
    }));
    return { board: newBoard, status: 'lost' };
  }

  // Flood fill for empty cells
  const stack = [[row, col]];
  
  while (stack.length > 0) {
    const [currR, currC] = stack.pop()!;
    const currCell = newBoard[currR][currC];

    if (currCell.isRevealed || currCell.isFlagged) continue;

    currCell.isRevealed = true;

    if (currCell.neighborMines === 0) {
      DIRECTIONS.forEach(([dr, dc]) => {
        const nr = currR + dr;
        const nc = currC + dc;
        if (nr >= 0 && nr < newBoard.length && nc >= 0 && nc < newBoard[0].length) {
          if (!newBoard[nr][nc].isRevealed && !newBoard[nr][nc].isFlagged) {
            stack.push([nr, nc]);
          }
        }
      });
    }
  }

  // Check win condition
  const flattened = newBoard.flat();
  const nonMines = flattened.filter(c => !c.isMine);
  const allRevealed = nonMines.every(c => c.isRevealed);

  return { 
    board: newBoard, 
    status: allRevealed ? 'won' : 'playing' 
  };
}

export function toggleFlag(board: Board, row: number, col: number): Board {
  const newBoard = [...board.map(row => [...row])];
  const cell = newBoard[row][col];

  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }

  return newBoard;
}
