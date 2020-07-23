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

function chainLengthResult(obj) {
  const {
    nChainring, nCog, lChain, nChain, lRestChain, lRestLinks,
  } = obj;
  return `
    For chainring and cog with, respectively, ${nChainring} and
    ${nCog} teeth the minimum chain length is ${show.mm(lChain)}.
    That corresponds to ${nChain} links with ${show.mm(lRestChain)}
    remaining for slack (${lRestLinks.toFixed(1)} links).
    `;
}

module.exports = {show, help, chainLengthResult};
