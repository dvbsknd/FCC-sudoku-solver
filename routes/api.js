import SudokuSolver from '../controllers/sudoku-solver';

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.use((req, res, next) => {
    console.log('[API]', req.method, req.body);
    next();
  });

  app.use((req, res, next) => {
    res.error = (err) => {
      console.log('[API] Error:', err);
      res.status(200);
      res.json({ error: err.message });
    };
    next();
  });

  app.route('/api/check')
    .post((req, res) => {
      try {
        const { puzzle, coordinate, value } = req.body;
        const { row, col } = solver.parseCoordinate(coordinate);
        const parsed = solver.check({ number: value, row, col }, puzzle);
        res.json({ parsed });
      } catch (err) {
        res.error(err);
      };
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        const { puzzle } = req.body;
        if (!puzzle) throw new Error('Required field missing');
        const solution = solver.solve(puzzle);
        res.json({ solution });
      } catch (err) {
        res.error(err);
      };
    });
};
