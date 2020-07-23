// formats output nicely
const yaml = require('js-yaml');
const units = require('./units');

// private, format physical values with units
// showInUnits:: Object -> String -> Integer -> Number -> String
const showInUnits = unitDict => unitToken => decimals => (...values) => {
  const converteds = values.map(x => (x / unitDict[unitToken])
    .toFixed(decimals));
  return converteds.map(x => `${x} ${unitToken}`).join(', ');
};

const show = {
  // mmString Number -> String
  mm: showInUnits(units.length.values)('mm')(1),
  deg: showInUnits(units.angle.values)('deg')(1),
};

// formats list of CLI arguments (obj) for help text
function help(obj) {
  return yaml.safeDump(obj);
}

module.exports = {show, help};
