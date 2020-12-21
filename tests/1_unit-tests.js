import { assert } from 'chai';
import SudokuSolver, { createArray, validatePuzzleString, validateGuess } from '../controllers/sudoku-solver.js';
const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
const rows = createArray(puzzle);

suite('UnitTests', () => {
  suite('#validatePuzzleString', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
      const result = validatePuzzleString(puzzle);
      assert.equal(result, puzzle);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
      const badCharPuzzle = 'X' + puzzle.slice(1);
      const callFn = () => validatePuzzleString(badCharPuzzle);
      assert.throws(callFn, Error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      const tooShortPuzzle = puzzle.slice(0, 80);
      const callFn = () => validatePuzzleString(tooShortPuzzle);
      assert.throws(callFn, Error, 'Expected puzzle to be 81 characters long');
    });
  });

  suite('#validateGuess', () => {
    test('Logic handles a valid row placement', () => {
      const guess = { number: 6, row: 0, col: 1 };
      const result = validateGuess(guess, rows);
      assert.isTrue(result.valid);
    });

    test('Logic handles an invalid row placement', () => {
      const guess = { number: 1, row: 0, col: 1 };
      const result = validateGuess(guess, rows);
      assert.isFalse(result.valid);
      assert.include(result.conflict, 'row');
    });

    test('Logic handles a valid column placement', () => {
      const guess = { number: 6, row: 0, col: 1 };
      const result = validateGuess(guess, rows);
      assert.isTrue(result.valid);
    });

    test('Logic handles an invalid column placement', () => {
      const guess = { number: 6, row: 0, col: 0 };
      const result = validateGuess(guess, rows);
      assert.isFalse(result.valid);
      assert.include(result.conflict, 'column');
    });

    test('Logic handles a valid region (3×3 grid) placement', () => {
      const guess = { number: 1, row: 1, col: 2 };
      const result = validateGuess(guess, rows);
      assert.isTrue(result.valid);
    });

    test('Logic handles an invalid region (3×3 grid) placement', () => {
      const guess = { number: 3, row: 1, col: 2 };
      const result = validateGuess(guess, rows);
      assert.isFalse(result.valid);
      assert.include(result.conflict, 'region');
    });
  });

  suite('SudokuSolver#solve', () => {
    const solver = new SudokuSolver();

    test('Valid puzzle strings pass the solver', () => {
      const result = solver.solve(puzzle);
      assert.equal(result, solution);
    });

    test('Invalid puzzle strings fail the solver', () => {
      const badPuzzle = '......' + puzzle.slice(6);
      const callFn = () => solver.solve(badPuzzle);
      assert.throws(callFn, Error, 'Puzzle cannot be solved');
    });

    test('Solver returns the the expected solution for an incomplete puzzzle', () => {
      const unfinishedPuzzle = solution.slice(0, 6) + '.' + solution.slice(7);
      const result = solver.solve(unfinishedPuzzle);
      assert.equal(result, solution);
    });
  });
});
