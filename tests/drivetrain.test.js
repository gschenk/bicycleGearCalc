const Drivetrain = require('../src/drivetrain');

describe('test drivetrain functions', () => {
  test.each([
    [[0.42, 0.0127, 0, 1, 1], [50, 15], 1.265551],
    [[0.42, 0.0127, 0, 1, 1], [42, 20], 1.239167],
    [[0.43, 0.0127, 0, 1, 1], [32, 45], 1.351116],
    [[0.44, 0.0127, 0, 1, 1], [50, 15], 1.305008],
    [[0.42, 0.0127, 0.1, 0.9, 0.9], [50, 15], 1.265551],
  ])('Drivetrain length, Chain pitch, wear (chain, ring, cog) %s, naiveChainLength(%s)', (ps, as, b) => {
    const drivetrain = new Drivetrain(...ps);
    const a = drivetrain.naiveChainLength(...as);
    expect(a).toBeCloseTo(b, 5)
  });
  test.each([
    [[0.42, 0.0127, 0, 1, 1], [50, 15]],
    [[0.42, 0.0127, 0, 1, 1], [42, 20]],
    [[0.43, 0.0127, 0, 1, 1], [32, 45]],
    [[0.44, 0.0127, 0, 1, 1], [50, 15]],
    [[0.42, 0.0127, 0.1, 0.9, 0.9], [50, 15]],
  ])('chordal chain length similar to naive chain length', (ps, as) => {
    const drivetrain = new Drivetrain(...ps);
    const a = drivetrain.naiveChainLength(...as);
    const b = drivetrain.chainLength(...as);
    expect(a).toBeCloseTo(b, 1)
  });
  test.each([
    [[0.42, 0.0127, 0, 1, 1], [50, 15], 1.26469],
    [[0.42, 0.0127, 0, 1, 1], [42, 20], 1.23841],
    [[0.43, 0.0127, 0, 1, 1], [32, 45], 1.35056],
    [[0.44, 0.0127, 0, 1, 1], [50, 15], 1.30415],
    [[0.42, 0.0127, 0.1, 0.9, 0.9], [50, 15], 1.221146],
  ])('Drivetrain length, Chain pitch, wear (chain, ring, cog) %s, chordalChainLength(%s)', (ps, as, b) => {
    const drivetrain = new Drivetrain(...ps);
    const a = drivetrain.chainLength(...as);
    expect(a).toBeCloseTo(b, 5)
  });
});
