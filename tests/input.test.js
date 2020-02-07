const Input = require('../src/input');

const template = {
  a: {a: 'length', 'a 1': 'bool'},
  b: {u: 'text', 1: 'length'},
  c: {334: 'length', 'a 1': 'bool'},
  d: {a: 'length', b: 'bool'},
  e: {n: 'number', m: 'length'},
};

const data = {
  a: {a: '0.5 xyz', 'a 1': true},
  b: {u: 'bli bla', 1: ''},
  c: {334: '0.5324 xxx', nonono: '1 xyz'},
  e: {n: 1, m: '2 xyz'},
};
const badKey = 'nonono'; // this key from input should be filtered out

const defaults = {
  a: {a: '1 xyz', 'a 1': false, gg: '10 xyz'},
  b: {u: 'foo bar', 1: '2 xyz'},
  c: {334: '35 xyz'},
  d: {a: '1 xyz'},
};


// mock units object
const units = {length: {values: {xyz: 3}, translations: {}}};

describe('Unit class testing:', () => {
  const dataObject = new Input(
    units,
    template,
    defaults,
    data,
  );
  test('Constructor returns expected object for given input objects', () => {
    const expected = {
      a: {a: 1.5, 'a 1': true},
      b: {1: 6, u: 'bli bla'},
      c: {334: NaN},
      d: {a: 3},
      e: {m: 6, n: 1},
    };
    expect(JSON.stringify(dataObject)).toBe(JSON.stringify(expected));
  });
  test('Returned object does not contain invalid key', () => {
    expect(dataObject.c).toEqual(expect.not.stringContaining(badKey));
  });
});
