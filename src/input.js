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
  const factor = pwitch(dict.values)(NaN)(unitStr);
  return factor && value ? factor * value : NaN;
};


// validate :: Obj -> Bool
function validate(input) {
  return true; // stub
}

// validate :: Obj -> Obj
function parseAndConvert(units, input) {
  const toM = unitConversion(units.length);
  const toN = unitConversion(units.force);
  return {
    foo: {bar: toM(input.foo.bar)},
  };
}


module.exports = {parseAndConvert};
