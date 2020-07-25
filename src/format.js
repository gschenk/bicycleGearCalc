// formats output nicely
const yaml = require('js-yaml');

// private, format physical values with units
// showInUnits:: Object -> String -> Integer -> Number -> String
const showInUnits = unitDict => unitToken => decimals => (...values) => {
  const converteds = values.map(x => (x / unitDict[unitToken])
    .toFixed(decimals));
  return converteds.map(x => `${x} ${unitToken}`).join(', ');
};

const proseTemplate = ss => `
    For chainring and cog with, respectively, ${ss[0]} and
    ${ss[1]} teeth the minimum chain length is ${ss[2]}.
    That corresponds to ${ss[3]} links with ${ss[4]}
    remaining for slack (${ss[5]} links).
    `;

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

// constructed with units object, provides functions that
// format results (and other) output
class Format {
  constructor(units) {
    // formats list of CLI arguments (obj) for help text
    // help :: Obj -> String
    this.help = yaml.safeDump;

    // functions that return strings of physical values with units
    this.show = {
      // [Number] -> String
      int: `${Math.round}`,
      fix2: (...xs) => xs.map(x => x.toFixed(2)).join(', '),
      mm: showInUnits(units.length.values)('mm')(1),
      cm: showInUnits(units.length.values)('cm')(1),
      deg: showInUnits(units.angle.values)('deg')(1),
    };

    // returns a yaml formated string of a matrix (cog, chainring)
    // with excess chain length remaining for slack as values
    this.slackMatrix = cogRingMatrix(o => this.show.mm(o.lRestChain));

    // returns a yaml formated string of a matrix (cog, chainring)
    // with number of links in chain - slack links as values
    this.linksMatrix = cogRingMatrix(
      o => `${o.nChain} - ${this.show.fix2(o.lRestLinks)}`,
    );

    // takes a single cog/chainring results object and returns string
    this.chainLengthProse = obj => proseTemplate([
      obj.nChainring,
      obj.nCog,
      this.show.cm(obj.lChain),
      obj.nChain,
      this.show.mm(obj.lRestChain),
      this.show.fix2(obj.lRestLinks),
    ]);
  }
}

module.exports = Format;
