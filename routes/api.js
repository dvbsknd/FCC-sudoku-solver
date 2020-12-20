import SudokuSolver from '../controllers/sudoku-solver';

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

    });

  app.route('/api/solve')
    .post((req, res) => {

    });
};
