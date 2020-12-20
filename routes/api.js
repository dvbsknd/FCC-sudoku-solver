import SudokuSolver from '../controllers/sudoku-solver';

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.use((req, res, next) => {
    console.log('[API]', req.method, req.body);
    next();
  });

  app.route('/api/check')
    .post((req, res) => {
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      res.json({ solution: solver.solve(puzzle) });
    });
};
