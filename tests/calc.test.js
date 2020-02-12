const Calc = require('../src/calc');

const EPS = Number.EPSILON;

describe('test calc functions', () => {
  test.each([
    [0.02, [50, 15, 0.5], 1.7675057782171542],
    [0.007, [50, 15, 0.5], 1.2418425516536482],
    [0.007, [20, 24, 0.5], 1.1531659116586976],
    [0.02, [50, 15, 0.3], 1.4474786504950377],
    [0.007, [50, 15, 0.3], 0.8514249858708007],
    [0.02, [50, 15, 1.5], 3.6890256028435613],
    [0.007, [50, 15, 1.5], 3.232278813296639],
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
