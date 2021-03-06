export default function SudokuSolver () {
};

SudokuSolver.prototype.validate = function (puzzleString) {
  return validatePuzzleString(puzzleString) === puzzleString;
};

SudokuSolver.prototype.check = function (guess, puzzleString) {
  return validateGuess(validateGuessInput(guess), createArray(validatePuzzleString(puzzleString)));
};

SudokuSolver.prototype.solve = function (puzzleString) {
  return createSolutionString(findSolution(createArray(validatePuzzleString(puzzleString))));
};

SudokuSolver.prototype.parseCoordinate = function (coord) {
  if (/^[A-Z][1-9]$/.test(coord) !== true) throw new Error('Invalid coordinate');
  else return { row: 'ABCDEFGHI'.indexOf(coord[0]), col: Number(coord[1]) - 1 };
};

export function validateGuessInput (guessInput) {
  const { number: num, row, col } = guessInput;
  const numIsValid = () => Number.isInteger(num) && num >= 1 && num <= 9;
  const rowIsValid = () => Number.isInteger(row) && row >= 0 && row <= 8;
  const colIsValid = () => Number.isInteger(col) && col >= 0 && col <= 8;
  if (rowIsValid() && colIsValid() && numIsValid()) return guessInput;
  else throw new Error('Invalid value');
};

export function validatePuzzleString (puzzleString) {
  if (typeof puzzleString !== 'string') throw new Error('Expected puzzle to be a string');
  if (puzzleString.length !== 9 * 9) throw new Error('Expected puzzle to be 81 characters long');
  if (/^[1-9.]*$/.test(puzzleString) !== true) throw new Error('Invalid characters in puzzle');
  else return puzzleString;
};

export function createArray (puzzleString) {
  function splitIntoRows (puzzleString) {
    return Array(9)
      .fill(null)
      .map((row, i) => {
        return puzzleString.slice(i * 9, i * 9 + 9);
      });
  };

  function parseToNumbers (array) {
    return array.map((item) => (item === '.' ? null : Number(item)));
  };

  return splitIntoRows(puzzleString).map((row) =>
    parseToNumbers(row.split(''))
  );
};

export function renderColumns (array) {
  return Array(9)
    .fill(null)
    .map((col, i) => {
      return array.map((row) => row[i]);
    });
};

export function renderRegions (arr) {
  return Array(9)
    .fill(null)
    .map((_, i) => {
      return Array(3)
        .fill(null)
        .map((_, j) => {
          const row = Math.floor(i / 3) * 3 + j;
          const start = (i % 3) * 3;
          return arr[row].slice(start, start + 3);
        })
        .flat()
        .filter((num) => num !== null);
    });
};

export function findSolution (puzzleArray) {
  const isSolved = (array) => array.filter((row) =>
    row.filter((item) => item === null).length > 0).length === 0;

  if (isSolved(puzzleArray)) return puzzleArray;
  else return findSolution(guessSolution(puzzleArray));

  function guessSolution (currentArray) {
    // Create a deep copy of the current array
    const rows = currentArray.map((row) => row.map((col) => col));
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Iterate over entire array, row by column
    let solvable = false;
    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < rows[row].length; col++) {
        if (puzzleArray[row][col] !== null) continue;
        const options = [];
        // Iterate over guesses and keep those that are valid
        for (let i = 0; i < numbers.length; i++) {
          const number = numbers[i];
          if (validateGuess({ number, row, col }, rows).valid !== true) continue;
          options.push(number);
        }
        if (options.length === 1) {
          // We have a singular solution so update the solution array
          // and restart the process
          rows[row][col] = options[0];
          solvable = true;
        }
      }
    }
    if (solvable) return rows;
    else throw new Error('Puzzle cannot be solved');
  };
};

export function validateGuess (guess, rows) {
  const inRow = (item, row) => row.indexOf(item) >= 0;
  const inColumn = (item, column) => column.indexOf(item) >= 0;
  const inRegion = (item, region) => region.indexOf(item) >= 0;
  const regionIdx = (row, col) => {
    return Math.floor(col / 3) + 3 * Math.floor(row / 3);
  };

  const { number, row, col } = guess;
  const columns = renderColumns(rows);
  const regions = renderRegions(rows);
  const currentRow = rows[row];
  const currentCol = columns[col];
  const currentRegion = regions[regionIdx(row, col)];

  const conflict = [];
  if (inRow(number, currentRow)) conflict.push('row');
  if (inColumn(number, currentCol)) conflict.push('column');
  if (inRegion(number, currentRegion)) conflict.push('region');

  const valid = conflict.length === 0;
  return { valid, conflict };
};

export function createSolutionString (solutionArray) {
  return solutionArray.flat().join('');
};
