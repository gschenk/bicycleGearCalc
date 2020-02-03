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


// takes units object, a function to return for units,
// and a token
// curry with units object, if token is included in its keys
// it returns the unit function curried with units[token],
// if not it returns an identity function
//
// pointUnitOther :: Object -> Function -> String -> Function
const pointUnitOther = unitDict => unitFunction => token => {
  const isUnit = Object.keys(unitDict).includes(token);
  // const isOther = ['boolean', 'number', 'text'].includes(token);
  return isUnit ? unitFunction(unitDict[token]) : (a => a);
};

// mapToAllKeys :: String s => {s: {s: a}}-> ( a -> b ) -> [[( a -> b )]]
const mapToAllKeys = o => f => Object.keys(o).map(
  k => Object.keys(o[k]).map(l => f(k, l)),
);

// validate :: Obj -> Bool
function validate() {
  return true; // stub
}

// parseAndConvert :: Obj -> Obj
function parseAndConvert(units, template, input) {
  // mapAllInputKeys :: ( a -> b ) -> [[( a -> b )]]
  const mapAllInputKeys = mapToAllKeys(input);

  // convert :: String -> String -> ( String -> Number )
  const convert = (a, b) => pointUnitOther(units)(unitConversion)(template[a][b]);

  return mapAllInputKeys((a, b) => convert(a, b)(input[a][b]));
}


module.exports = {validate, parseAndConvert};
