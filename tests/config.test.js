const Config = require('../src/config');
const defaults = require('../src/defaults');


const knownArgsValues = Object.keys(defaults.knownCliArguments)
  .map(k => defaults.knownCliArguments[k])
  .filter((a, i, as) => as.indexOf(a) === i);

const configForArgKeys = Object.keys(defaults.configForArg('foobar'));

const defaultCfgKeys = Object.keys(defaults.defaultCfg);

// arraySetIdentity :: [String] -> [String] -> Bool
const arraySetIdentity = (as, bs) => {
  const allAsInBs = as.map(s => bs.includes(s)).reduce((x, y) => x && y);
  const equalSize = as.length === bs.length;
  return allAsInBs && equalSize;
};

describe('default.js objects consistency', () => {
  test('default error `err: 0` is in defaultCfg', () => {
    expect(defaults.defaultCfg.err).toBe(0);
  });
  test('identical set of keys A', () => {
    expect(arraySetIdentity(knownArgsValues, configForArgKeys));
  });
  test('identical set of keys B', () => {
    const keysNoErr = defaultCfgKeys.filter(a => a === 'err' ? false : a);
    expect(arraySetIdentity(knownArgsValues, keysNoErr));
  });
});

describe('config.js config() returns correct objects', () => {
  const config = args => new Config(
    args,
    defaults.defaultCfg,
    defaults.knownCliArguments,
    defaults.configForArg,
  );
  test.each([[[], 0], [['-'], 0], [['-', '-v', '-h'], 7], [['sldjf'], 22]])(
    'For CLI arguments %s config() returns correct error state %i',
    (as, b) => {
      expect(config(['foo', 'bar', ...as]).err).toBe(b);
    },
  );
  test.each(defaultCfgKeys)(
    'For no CLI argumetns config() returns defaultCfg value for key %s',
    key => {
      expect(config(['foo', 'bar'])[key]).toBe(defaults.defaultCfg[key]);
    },
  );
});
