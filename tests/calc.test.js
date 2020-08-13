const Calc = require('../src/calc');

const EPS = Number.EPSILON;

describe('test calc functions', () => {
  test.each([
    [0.02, [50, 15, 0.5], 1.7675057782171542],
    [0.007, [50, 15, 0.5], 1.2418425516536482],
    [0.007, [20, 24, 0.5], 1.1540397181669126],
    [0.02, [50, 15, 0.3], 1.2918692739191568],
    [0.007, [50, 15, 0.3], 0.8325753415738001],
    [0.02, [50, 15, 1.5], 3.658278373441203],
    [0.007, [50, 15, 1.5], 3.22851369110037],
  ])('Chain pitch %f, naiveChainLength(...%s)', (p, as, b) => {
    const calc = new Calc(p);
    const a = calc.naiveChainLength(...as);
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
  test.each([
    [[67, 130, 5], 405, 403.4956435638432],
    [[67, 130, 5, 90], 405, 403.8873605350878],
    [[67, 130, 5, 20], 405, 403.01985062773275],
    [[67, 130, 5], 420, 418.54956023749446],
    [[67, 120, 5], 405, 403.8966258524575],
    [[92, 135, 5], 405, 404.0309394093477],
  ])('drivetrain length from geometry (%s, %s)', (as, b, expected) => {
    const calc = new Calc(1, ...as);
    const calculated = calc.drivetrainLength(b);
    expect(Math.abs(calculated - expected)).toBeLessThan(2 * EPS);
  });
});

// describe('default.js objects consistency', () => {
//   test('default error `err: 0` is in defaultCfg', () => {
//     expect(defaults.defaultCfg.err).toBe(0);
//   });
