import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const clickSquare = (index) => {
  fireEvent.click(screen.getByTestId(`square-${index}`));
};

describe('Tic-Tac-Toe App', () => {
  test('shows initial status and empty board', () => {
    render(<App />);
    expect(screen.getByTestId('status-text')).toHaveTextContent('Next player: X');

    // All squares start empty (no X/O text)
    for (let i = 0; i < 9; i += 1) {
      expect(screen.getByTestId(`square-${i}`)).toHaveTextContent('');
    }
  });

  test('places X then O on successive clicks', () => {
    render(<App />);

    clickSquare(0);
    expect(screen.getByTestId('square-0')).toHaveTextContent('X');
    expect(screen.getByTestId('status-text')).toHaveTextContent('Next player: O');

    clickSquare(1);
    expect(screen.getByTestId('square-1')).toHaveTextContent('O');
    expect(screen.getByTestId('status-text')).toHaveTextContent('Next player: X');
  });

  test('detects a win and prevents further moves', () => {
    render(<App />);

    // X wins top row: X at 0,1,2; O plays 3,4
    clickSquare(0); // X
    clickSquare(3); // O
    clickSquare(1); // X
    clickSquare(4); // O
    clickSquare(2); // X (win)

    expect(screen.getByTestId('status-text')).toHaveTextContent('Winner: X');

    // Further moves should be ignored because gameOver
    clickSquare(5);
    expect(screen.getByTestId('square-5')).toHaveTextContent('');
  });

  test('new game button resets the board and status', () => {
    render(<App />);

    clickSquare(0);
    clickSquare(1);

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));

    expect(screen.getByTestId('status-text')).toHaveTextContent('Next player: X');
    for (let i = 0; i < 9; i += 1) {
      expect(screen.getByTestId(`square-${i}`)).toHaveTextContent('');
    }
  });
});
