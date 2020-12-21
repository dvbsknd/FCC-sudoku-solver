export default function SudokuSolver () {
};

SudokuSolver.prototype.check = function (puzzleString) {
  throw new Error('Check needs to be implemented');
};

SudokuSolver.prototype.solve = function (puzzleString) {
  return createSolutionString(findSolution(createArray(this.validate(puzzleString))));
};

SudokuSolver.prototype.validate = function (puzzleString) {
  if (typeof puzzleString === 'string' &&
    puzzleString.length === 9 * 9) return puzzleString;
  else throw new Error('Expected puzzle to be 81 characters long');
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

export function renderGroups (arr) {
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
  const inRow = (item, row) => row.indexOf(item) >= 0;
  const inColumn = (item, column) => column.indexOf(item) >= 0;
  const inGroup = (item, group) => group.indexOf(item) >= 0;
  const getGroupIdx = (row, col) => {
    return Math.floor(col / 3) + 3 * Math.floor(row / 3);
  };
  const isSolved = (array) => array.filter((row) =>
    row.filter((item) => item === null).length > 0).length === 0;

  if (isSolved(puzzleArray)) return puzzleArray;
  else return findSolution(guessSolution(puzzleArray));

  function guessSolution (currentArray) {
    // Create a deep copy of the current array
    const rows = currentArray.map((row) => row.map((col) => col));
    const guesses = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const columns = renderColumns(rows);
    const groups = renderGroups(rows);

    // Iterate over entire array, row by column
    let solvable = false;
    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < rows[row].length; col++) {
        if (puzzleArray[row][col] !== null) continue;
        const options = [];
        // Iterate over guesses and keep those that are valid
        for (let i = 0; i < guesses.length; i++) {
          const guess = guesses[i];
          const currentRow = rows[row];
          const currentCol = columns[col];
          const currentGroup = groups[getGroupIdx(row, col)];
          if (inRow(guess, currentRow)) continue;
          if (inColumn(guess, currentCol)) continue;
          if (inGroup(guess, currentGroup)) continue;
          options.push(guess);
        }
        if (options.length === 1) {
          // We have a singular solution so update the solution array
          // and restart the process
          rows[row][col] = options[0];
          solvable = true;
          // console.log(`${row}:${col}`);
          // console.log(puzzleArray[row][col]);
          // console.log(solution[row][col]);
          // console.log(options);
        }
      }
    }
    if (solvable) return rows;
    else throw new Error('Can\'t solve this one');
  };
};

export function createSolutionString (solutionArray) {
  return solutionArray.flat().join('');
};
