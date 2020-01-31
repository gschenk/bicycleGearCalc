// reads yaml input file
const yaml = require('js-yaml');
const fs = require('fs');
const tools = require('./tools');

const pwitch = tools.pureSwitch;

// tools.pureSwitch()

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

// non-pure
function readFile(inFilePath) {
  // mutable binding to get variable before try scope
  let YmlDoc = {};
  // safeLoad from js-yaml loads one document per yaml file
  try {
    YmlDoc = yaml.safeLoad(fs.readFileSync(inFilePath, 'utf8'));
  } catch (e) {
    console.log(e);
  }
  return YmlDoc;
}

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


module.exports = {readFile, parseAndConvert};
