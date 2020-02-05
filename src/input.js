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


// this is probably obsolete now
const arrayOfObjects = {
  // mapToAllKeys :: String s => {s: {s: a}}-> ( a -> b ) -> [[( a -> b )]]
  mapToAllKeys: o => f => Object.keys(o).map(
    k => Object.keys(o[k]).map(l => f(k, l)),
  ),

  // filterByKey:: String s =>  s -> [{s: a}] -> a -> [{s: a}]
  filterByKey: k => os => a => os.filter(o => o[k] === a),

  // uniqueValuesForKey String s => s -> [{s: a}] -> [a]
  uniqueValuesForKey: k => os => os.map(o => o[k]).reduce(
    (as, a) => as.includes(a) ? as : [...as, a],
    [],
  ),

  // toObjectsArray :: String s => {s: {s: a}} -> [{s: s, s: s, s: a}]
  toObjectsArray(object) {
    return this.mapToAllKeys(object)(
      (k, l) => ({topKey: k, deepKey: l, value: object[k][l]}),
    ).flat();
  },

  // inverse of toObjectsArray
  // toNestedObject String s => [{s: s, s: s, s: a}] -> { s: {s: a} }
  toNestedObject(objects) {
    const filterByTopKey = this.filterByKey('topKey')(objects);
    const topKeys = this.uniqueValuesForKey('topKey')(objects);
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
