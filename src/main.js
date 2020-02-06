const Config = require('./config');
const defaults = require('./defaults');
const tools = require('./tools');
const units = require('./units');
const read = require('./read');
const Input = require('./input');
const Calc = require('./calc');


const config = new Config(
  process.argv,
  defaults.defaultCfg,
  defaults.knownCliArguments,
  defaults.configForArg,
);
Object.freeze(config);

console.log(config);

// closure on Data constructor
function InData(dataObject) {
  return new Input(
    units,
    read.readFile(config.templates.input),
    read.readFile(config.templates.inputDefaults),
    dataObject,
  );
}

const inData = new InData(
  read.readFile(config.file),
);

console.log(
  inData,
);


if (config.err !== 0) {
  const errCodes = {
    7: 'E2BIG too many arguments',
    22: 'EINVAL unknown argument',
  };
  console.error(tools.pureSwitch(errCodes)('unknown error')(`${config.err}`));
  process.exit(config.err);
}

if (config.help) {
  console.log(
    'This programme accepts up to two comand line arguments from the following set:',
  );
  console.log(defaults.knownCliArguments);
  process.exit(0);
  console.log(
    'where .yaml and .yml denote any input file, including path, with that end.',
  );
}

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

const calc = new Calc(inData.chain.pitch);

// const rChainring = calc.sprocketRadius(inData.chain.pitch)(inData.chainring.teeth);
// const rCog = calc.sprocketRadius(inData.chain.pitch)(inData.cog.teeth);
// const lFreeChain = calc.upFreeChainLength(rChainring, rCog, inData.drivetrain.length);
// const aJoin = calc.chainJoinAngle(rChainring, rCog, inData.drivetrain.length);
const lChain = calc.naiveChainLength(inData.chainring.teeth, inData.cog.teeth, inData.drivetrain.length);
const nChain = calc.chainLengthToN(lChain);
const lRestChain = calc.chainLengthRest(lChain);

// provisional output
const outputString = `
The bike's drivetrain is ${show.mm(inData.drivetrain.length)} long.
For chainring and cog with ${inData.chainring.teeth} and ${inData.cog.teeth} teeth, respectively,
the minimum chain length is ${show.mm(lChain)}. That corresponds to ${nChain} links
with a ${show.mm(lRestChain)} rest.
`;

console.log(outputString);
