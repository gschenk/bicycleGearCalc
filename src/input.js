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


class Input {
  constructor(template, units, data) {
    const knownUnits = Object.keys(units);
    const convert = token => unitConversion(units[token]);
    const outerKeys = Object.keys(template)
      .filter(o => Object.keys(data).includes(o));

    outerKeys.map(k => {
      const innerKeys = Object.keys(template[k])
        .filter(o => Object.keys(data[k]).includes(o));
      innerKeys.map(l => {
        const token = template[k][l];
        const isUnit = knownUnits.includes(token);
        const value = isUnit ? convert(token)(data[k][l]) : data[k][l];
        this[k] = {[l]: value};
        return null;
      });
      return null;
    });
    Object.seal(this);
  }
}

module.exports = Input;
