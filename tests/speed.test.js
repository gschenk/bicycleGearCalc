const Speed = require('../src/speed');

describe('test speed calculation', () => {
  test.each([
    [[0.622, 0.028, 0.0], [1, 50, 12], 8.87499],
    [[0.622, 0.028, 0.15], [1, 50, 12], 8.7650],
    [[0.622, 0.028, 0.0], [1, 42, 18], 4.9700],
    [[0.559, 0.04, 0.0], [1, 42, 18], 4.6841],
    [[0.559, 0.04, 0.15], [1, 42, 18], 4.5962],
  ])('wheel, tyre, depression (%s); cadence, ring teeth, cog teeth (%s)',
    (ps, as, b) => {
      const speed = new Speed(...ps);
      const a = speed.speed(as[0])(as[1], as[2]);
      expect(a).toBeCloseTo(b, 4);
    });
});
