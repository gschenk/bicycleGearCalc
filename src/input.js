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

const arrayOfObjects = {
  // toObjectsArray :: String s => {s: {s: a}} -> [{s: s, s: s, s: a}]
  toObjectsArray: o => mapToAllKeys(o)(
    (k, l) => ({topKey: k, deepKey: l, value: o[k][l]}),
  ).flat(),

  // filterByKey:: String s =>  s -> [{s: a}] -> a -> [{s: a}]
  filterByKey: k => os => a => os.filter(o => o[k] === a),

  // uniqueValuesForKey String s => s -> [{s: a}] -> [a]
  uniqueValuesForKey: k => os => os.map(o => o[k]).reduce(
    (as, a) => as.includes(a) ? as : [...as, a],
    [],
  ),

  // inverse of toObjectsArray
  // toNestedObject String s => [{s: s, s: s, s: a}] -> { s: {s: a} }
  toNestedObject(os) {
    const filterByTopKey = this.filterByKey('topKey')(os);
    const topKeys = this.uniqueValuesForKey('topKey')(os);
    const nestedByTopKey = topKeys.map(filterByTopKey);
    const innerObjects = nestedByTopKey.map(as => Object.assign(
      {},
      ...as.map(o => ({[o.deepKey]: o.value})),
    ));

    // zipper :: String -> a -> { s: a }
    const zipper = (k, a) => ({[k]: a});

    const nestedObjects = tools.zipWith(zipper)(topKeys)(innerObjects);
    return Object.assign({}, ...nestedObjects);
  },
};

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
