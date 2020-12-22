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
    test('Check a puzzle placement with all fields');

    test('Check a puzzle placement with single placement conflict');

    test('Check a puzzle placement with multiple placement conflicts');

    test('Check a puzzle placement with all placement conflicts');

    test('Check a puzzle placement with missing required fields');

    test('Check a puzzle placement with invalid characters');

    test('Check a puzzle placement with incorrect length');

    test('Check a puzzle placement with invalid placement coordinate');

    test('Check a puzzle placement with invalid placement value');
  });
});
