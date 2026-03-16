import React, { useMemo, useState } from 'react';
import './App.css';

const PLAYERS = {
  X: 'X',
  O: 'O',
};

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** This is the main application component hosting the Tic-Tac-Toe game. */
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState(PLAYERS.X);

  const { winner, winningLine, isDraw } = useMemo(() => {
    // Determine winner (if any)
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], winningLine: line, isDraw: false };
      }
    }

    // Draw if all filled and no winner
    const filled = board.every((cell) => cell !== null);
    return { winner: null, winningLine: null, isDraw: filled, };
  }, [board]);

  const gameOver = Boolean(winner) || isDraw;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'Draw game';
    return `Next player: ${nextPlayer}`;
  }, [winner, isDraw, nextPlayer]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /**
     * Handle a move on a square.
     * Prevents moves when game is over or square is already filled.
     */
    if (gameOver) return;
    if (board[index] !== null) return;

    setBoard((prev) => {
      const next = prev.slice();
      next[index] = nextPlayer;
      return next;
    });
    setNextPlayer((p) => (p === PLAYERS.X ? PLAYERS.O : PLAYERS.X));
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Reset the board and start a new game with X. */
    setBoard(Array(9).fill(null));
    setNextPlayer(PLAYERS.X);
  };

  const isWinningSquare = (index) =>
    Array.isArray(winningLine) ? winningLine.includes(index) : false;

  const getSquareAriaLabel = (index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const value = board[index];
    if (winner) {
      return `Square row ${row} column ${col}, ${value ? value : 'empty'}. Game over. Winner ${winner}.`;
    }
    if (isDraw) {
      return `Square row ${row} column ${col}, ${value ? value : 'empty'}. Game over. Draw.`;
    }
    return `Square row ${row} column ${col}, ${value ? value : 'empty'}. ${value ? 'Occupied.' : `Place ${nextPlayer}.`}`;
  };

  return (
    <div className="App">
      <header className="app-shell">
        <div className="app-card" role="application" aria-label="Tic-Tac-Toe">
          <div className="app-header">
            <div className="brand">
              <div className="brand-badge" aria-hidden="true">
                XO
              </div>
              <div className="brand-text">
                <h1 className="title">Tic-Tac-Toe</h1>
                <p className="subtitle">Retro local 2-player showdown</p>
              </div>
            </div>

            <div className="status" aria-live="polite" aria-atomic="true">
              <span className="status-label">Status</span>
              <span className="status-value" data-testid="status-text">
                {statusText}
              </span>
            </div>
          </div>

          <main className="game">
            <section className="board-wrap" aria-label="Game board">
              <div
                className="board"
                role="grid"
                aria-label="Tic-Tac-Toe board"
              >
                {board.map((value, idx) => {
                  const win = isWinningSquare(idx);
                  const isDisabled = gameOver || value !== null;
                  const cellState =
                    value === PLAYERS.X ? 'x' : value === PLAYERS.O ? 'o' : 'empty';

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={[
                        'square',
                        `square--${cellState}`,
                        win ? 'square--win' : '',
                      ].join(' ')}
                      onClick={() => handleSquareClick(idx)}
                      disabled={isDisabled}
                      aria-label={getSquareAriaLabel(idx)}
                      aria-pressed={value !== null ? 'true' : 'false'}
                      role="gridcell"
                      data-testid={`square-${idx}`}
                    >
                      <span className="square-inner" aria-hidden="true">
                        {value || ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="controls" aria-label="Game controls">
              <button
                type="button"
                className="btn btn-primary"
                onClick={resetGame}
                aria-label="Start a new game"
              >
                New game
              </button>

              <div className="hint" aria-hidden="true">
                {winner ? 'Winning line highlighted.' : isDraw ? 'No more moves.' : 'Tap a square to play.'}
              </div>
            </section>
          </main>
        </div>
      </header>
    </div>
  );
}

export default App;
