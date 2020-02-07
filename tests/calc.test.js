const Calc = require('../src/calc');

const EPS = Number.EPSILON;

describe('test calc functions', () => {
  test.each([
    [0.02, [50, 15, 0.5], 1.2610217643878125],
    [0.007, [50, 15, 0.5], 1.0790506856630142],
    [0.007, [20, 24, 0.5], 1.0487812986721408],
    [0.02, [50, 15, 0.3], 0.8970536697827493],
    [0.007, [50, 15, 0.3], 0.6834715102432194],
    [0.02, [50, 15, 1.5], 3.224956591581583],
    [0.007, [50, 15, 1.5], 3.074627510210886],
  ])('Chain pitch %f, naiveChainLength(...%s)', (p, as, b) => {
    const calc = new Calc(p);
    const a = calc.naiveChainLength(...as);
    expect(Math.abs(a - b)).toBeLessThan(2 * EPS);
  });
  test.each([
    [0.02, 1.11, 56],
    [0.02, 1.09, 56],
    [0.02, 1.081, 56],
    [0.02, 1.08, 54],
    [0.2, 1.0, 6],
  ])('links in chain with pitch %f and length %f', (p, a, b) => {
    const calc = new Calc(p);
    expect(
      calc.chainLengthToN(a),
    ).toBe(b);
  });
  test.each([
    [0.02, 1.11, 0.009999999999999926],
    [0.02, 1.09, 0.029999999999999943],
    [0.02, 1.081, 0.03900000000000006],
    [0.02, 1.08, 0.03999999999999995],
    [0.2, 1.0, 0.20000000000000007],
  ])('Rest in chain with pitch %f and length %f', (p, a, b) => {
    const calc = new Calc(p);
    expect(
      calc.chainLengthRest(a),
    ).toBe(b);
  });
});

// describe('default.js objects consistency', () => {
//   test('default error `err: 0` is in defaultCfg', () => {
//     expect(defaults.defaultCfg.err).toBe(0);
//   });
