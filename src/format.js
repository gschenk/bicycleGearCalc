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

// functions that return physical values with units
const show = {
  // [Number] -> String
  int: `${Math.round}`,
  fix2: (...xs) => xs.map(x => x.toFixed(2)).join(', '),
  mm: showInUnits(units.length.values)('mm')(1),
  deg: showInUnits(units.angle.values)('deg')(1),
};

// takes a single cog/chainring results object and returns string
function chainLengthProse(obj) {
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

// takes whole charinLengthResults object and prints results
// as cog, ring matrix yaml dump
const cogRingMatrix = fContent => obj => {
  const returnObj = obj
    .map(o => ({[o.nChainring]: {[o.nCog]: fContent(o)}}))
    .reduce((os, o) => {
      // join inner and outer nested object elements
      const k = Object.keys(o).join();
      const newO = Object.keys(os).includes(k)
        ? {[k]: {...os[k], ...o[k]}}
        : o;
      return {...os, ...newO};
    }, {});
  return yaml.safeDump(returnObj);
};

//  Format.cogRingMat(chainLengthResult, 'lRestChain', 'mm'),

class Format {
  constructor() {
    // formats list of CLI arguments (obj) for help text
    this.help = yaml.safeDump;
    this.show = show;
    this.chainLengthProse = chainLengthProse;

    this.slackMatrix = cogRingMatrix(o => this.show.mm(o.lRestChain));

    this.linksMatrix = cogRingMatrix(o => `${o.nChain} - ${this.show.fix2(o.lRestLinks)}`);
  }
}

module.exports = Format;
