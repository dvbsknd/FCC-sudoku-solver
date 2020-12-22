import app from '../server';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

suite('Functional Tests', () => {
  suite('POST request to /api/solve', () => {
    const endpoint = '/api/solve';
    test('Solve a puzzle with valid puzzle string', () => {
      chai.request(app).post(endpoint).send({ puzzle })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
        });
    });

    test('Solve a puzzle with missing puzzle string', () => {
      chai.request(app).post(endpoint).send({})
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Required field missing');
        });
    });

    test('Solve a puzzle with invalid characters', () => {
      const badCharPuzzle = 'X' + puzzle.slice(1);
      chai.request(app).post(endpoint).send({ puzzle: badCharPuzzle })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
        });
    });

    test('Solve a puzzle with incorrect length', () => {
      const tooShortPuzzle = puzzle.slice(0, 80);
      chai.request(app).post(endpoint).send({ puzzle: tooShortPuzzle })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        });
    });

    test('Solve a puzzle that cannot be solved', () => {
      const badPuzzle = '......' + puzzle.slice(6);
      chai.request(app).post(endpoint).send({ puzzle: badPuzzle })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
        });
    });
  });

  suite('POST request to /api/check', () => {
    const endpoint = '/api/check';
    test('Check a puzzle placement with all fields', () => {
      const data = { puzzle, coordinate: 'A1', value: '7' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          assert.isEmpty(res.body.conflict);
        });
    });

    test('Check a puzzle placement with single placement conflict', () => {
      const data = { puzzle, coordinate: 'A2', value: '1' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ['row']);
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', () => {
      const data = { puzzle, coordinate: 'A1', value: '1' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ['row', 'column']);
        });
    });

    test('Check a puzzle placement with all placement conflicts', () => {
      const data = { puzzle, coordinate: 'A1', value: '5' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ['row', 'column', 'region']);
        });
    });

    test('Check a puzzle placement with missing required fields', () => {
      const data = { puzzle, value: '5' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          // fCC test runner breaks if brackets are used in assertions!
          assert.match(res.body.error, /^Required field.* missing$/);
        });
    });

    test('Check a puzzle placement with invalid characters', () => {
      const data = { puzzle, coordinate: 'X1', value: '7' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Invalid value');
        });
    });

    test('Check a puzzle placement with incorrect length', () => {
      const tooShortPuzzle = puzzle.slice(0, 80);
      const data = { puzzle: tooShortPuzzle, coordinate: 'A1', value: '7' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', () => {
      const data = { puzzle, coordinate: 'A0', value: '7' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Invalid coordinate');
        });
    });

    test('Check a puzzle placement with invalid placement value', () => {
      const data = { puzzle, coordinate: 'A1', value: '0' };
      chai.request(app).post(endpoint).send(data)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'Invalid value');
        });
    });
  });
});
