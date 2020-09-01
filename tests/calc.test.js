const Calc = require('../src/calc');

const EPS = Number.EPSILON;

describe('test calc functions', () => {
  test.each([
    [0.02, [50, 15, 0.5], 1.7675057782171542],
  ])('Chain pitch %f, naiveChainLength(...%s)', (p, as, b) => {
    const calc = new Calc(p);
    const a = calc.naiveChainLength(...as);
  });
});
