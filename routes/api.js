import SudokuSolver from '../controllers/sudoku-solver';

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'development') console.log('[API]', req.method, req.body);
    next();
  });

  app.use((req, res, next) => {
    res.error = (err) => {
      if (process.env.NODE_ENV !== 'test') console.log('[API] Error:', err);
      res.status(400);
      res.json({ error: err.message });
    };
    next();
  });

  app.route('/api/check')
    .post((req, res) => {
      try {
        const { puzzle, coordinate, value } = req.body;
        if (!puzzle || !coordinate || !value) throw new Error('Required field(s) missing');
        const number = Number(value);
        const { row, col } = solver.parseCoordinate(coordinate);
        res.json(solver.check({ number, row, col }, puzzle));
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
