const Drivetrain = require('../src/drivetrain');

const EPS = Number.EPSILON;

describe('test drivetrain functions', () => {
  test.each([
    [0.02, [50, 15, 0.5], 1.7675057782171542],
  ])('Chain pitch %f, naiveChainLength(...%s)', (p, as, b) => {
    const drivetrain = new Drivetrain(p);
    const a = drivetrain.naiveChainLength(...as);
  });
});
