export default function SudokuSovler () {
  this.check = function (problemString) {
    throw new Error('Check needs to be implemented');
  };

  this.solve = function (problemString) {
    return createSolutionString(findSolution(createArray(problemString)));
  };

  function splitIntoRows (problemString) {
    return Array(9)
      .fill(null)
      .map((row, i) => {
        return problemString.slice(i * 9, i * 9 + 9);
      });
  };

  function createArray (problemString) {
    return splitIntoRows(problemString).map((row) =>
      parseToNumbers(row.split(''))
    );
  };

  function parseToNumbers (array) {
    return array.map((item) => (item === '.' ? null : Number(item)));
  };

  function renderColumns (array) {
    return Array(9)
      .fill(null)
      .map((col, i) => {
        return array.map((row) => row[i]);
      });
  };

  function renderGroups (arr) {
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

  const inRow = (item, row) => row.indexOf(item) >= 0;
  const inColumn = (item, column) => column.indexOf(item) >= 0;
  const inGroup = (item, group) => group.indexOf(item) >= 0;
  const getGroupIdx = (row, col) => {
    return Math.floor(col / 3) + 3 * Math.floor(row / 3);
  };
  const isSolved = (array) => array.filter((row) =>
    row.filter((item) => item === null).length > 0).length === 0;

  function findSolution (puzzleArray) {
    if (isSolved(puzzleArray)) return puzzleArray;
    else return findSolution(guessSolution(puzzleArray));

    function guessSolution (puzzleArray) {
      const solution = puzzleArray.map((row) => row.map((col) => col));
      const guesses = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      // Iterate over entire array, row by column
      let solvable = false;
      for (let row = 0; row < solution.length; row++) {
        for (let col = 0; col < solution[row].length; col++) {
          if (puzzleArray[row][col] !== null) continue;
          const options = [];
          // Iterate over guesses and keep those that are valid
          for (let i = 0; i < guesses.length; i++) {
            const guess = guesses[i];
            const currentRow = solution[row];
            const currentCol = renderColumns(solution)[col];
            const currentGroup = renderGroups(solution)[getGroupIdx(row, col)];
            if (inRow(guess, currentRow)) continue;
            if (inColumn(guess, currentCol)) continue;
            if (inGroup(guess, currentGroup)) continue;
            options.push(guess);
          }
          if (options.length === 1) {
            // We have a singular solution so update the solution array
            // and restart the process
            solution[row][col] = options[0];
            solvable = true;
            // console.log(`${row}:${col}`);
            // console.log(puzzleArray[row][col]);
            // console.log(solution[row][col]);
            // console.log(options);
          }
        }
      }
      if (solvable) return solution;
      else throw new Error('Can\'t solve this one');
    };
  };

  function createSolutionString (solutionArray) {
    return solutionArray.flat().join('');
  };
};
