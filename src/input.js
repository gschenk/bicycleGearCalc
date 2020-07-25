// comprehends input
const tools = require('./tools');

const pwitch = tools.pureSwitch;

// in: dicitionary symbol to value
// in: dictiionary symbol translations
// return: Number, or false when cannot comprehend
// unitConversion :: String s => {s: {s: s}} -> s -> a
const unitConversion = dict => valUnit => {
  const [valStr, unitStr] = valUnit.split(' ');
  const value = Number(valStr);
  const factor = dict !== undefined
    ? pwitch(dict.values)(NaN)(unitStr)
    : 1;
  return factor && value ? factor * value : NaN;
};

// arrayConversion :: String -> String -> [a]
const arrayConversion = isNumber => valStr => {
  const f = isNumber
    ? a => parseFloat(a)
    : a => a;
  // values with units may only be split by comma,
  // other values also by empty space
  const values = /\s|,\s/.test(valStr)
    ? valStr.split(/\s+|,\s+/)
      .filter(a => a)
      .map(f)
    : [valStr];
  return values;
};

// returns unique keys all objects passed to it have amongst each other
const combinedUniqeKeys = (...os) => [...os.map(o => Object.keys(o))]
  .flat()
  .filter((k, i, ks) => ks.indexOf(k) === i);

// validKeys :: Objects -> Object -> [String]
const validKeys = (...os) => (...ps) => tools.reduceSort(
  combinedUniqeKeys(...os)
    .filter(o => combinedUniqeKeys(...ps).includes(o)),
);

// creates objects holding input data
// the data is structured as the `template` which also
// sets the physical properties. Data from `data` are
// converted following rules set out in `units`. If no
// conversion rules are present for the physical type
// the data value is returned unchanged.
// For missing data `defaults` may be filled in.
//
// The output is an object with nested data where all physical values
// are converted to SI units. And that only contains attributes that
// are in `template` as well as in either `data` or `deftauls` objects.
class Input {
  // constructor : Object a, Object b, Object c: a -> b -> b -> b -> c
  constructor(units, template, defaults, data) {
    const knownUnits = Object.keys(units);
    const convert = token => unitConversion(units[token]);

    // all keys that are in the template and for which data or default
    // data are present.
    const outerKeys = validKeys(template)(data, defaults);

    outerKeys.map(k => {
      // The lot of ternary operators are there to ensure that there is always
      // a data object even if the higher level key is missing in `data`
      const innerDefault = defaults[k] ? defaults[k] : {};
      const innerData = data[k] ? data[k] : innerDefault;
      const innerKeys = validKeys(template[k])(innerData, innerDefault);

      const result = innerKeys.map(l => {
        // tests for special input cases
        const token = template[k][l];
        const isUnit = knownUnits.includes(token);
        const isArray = /array/.test(token);
        const isNumber = /number/.test(token);

        const rawValue = innerData[l] ? innerData[l] : defaults[k][l];
        const value = isUnit
          ? convert(token)(rawValue)
          : isArray
          ? arrayConversion(isNumber)(rawValue)
          : rawValue;

        // here's the actual property asignment in this constructor
        // this may be controversial, confer:
        // https://stackoverflow.com/q/60048450/3842889
        return {[l]: value};
      });
      this[k] = result.reduce((os, o) => ({...os, ...o}), {});
      Object.freeze(this[k]);
      return null;
    });
    Object.freeze(this);
  }
}

module.exports = Input;
