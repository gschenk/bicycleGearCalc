const Config = require('./config');
const defaults = require('./defaults');
const tools = require('./tools');
const units = require('./units');
const read = require('./read');
const Input = require('./input');
const Calc = require('./calc');
const chain = require('./chain');


// switchedLog :: Bool -> Function
const switchedLog = b => b ? console.log : (() => undefined);

// some functions that need a more suitable home
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

// putting configuration together
const config = new Config(
  process.argv,
  defaults.defaultCfg,
  defaults.knownCliArguments,
  defaults.configForArg,
);
Object.freeze(config);

// setting verbose output function
const vLog = switchedLog(config.verbose);

vLog('Config', config);


// closure on Data constructor
function InData(dataObject) {
  return new Input(
    units,
    read.readFile(config.templates.input),
    read.readFile(config.templates.inputDefaults),
    dataObject,
  );
}


// read input data
const inData = new InData(
  read.readFile(config.file),
);

vLog(inData);


// error handling
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


// calculations
const calc = new Calc(inData.chain.pitch);

const chainProps = chain.chainProperties(calc);

const chainLengthResult = inData.chainring.teeth
  .map(m => inData.cog.teeth.map(n => chainProps(inData.drivetrain.length)(m, n)))
  .flat();

// provisional output
console.log(
  chainLengthResult.map(o => {
    const {
      nChainring, nCog, lChain, nChain, lRestChain, lRestLinks,
    } = o;
    return `
    The bike's drivetrain is ${show.mm(inData.drivetrain.length)} long. For
    chainring and cog with, respectively, ${nChainring} and
    ${nCog} teeth the minimum chain length is ${show.mm(lChain)}.
    That corresponds to ${nChain} links with ${show.mm(lRestChain)}
    remaining for slack (${lRestLinks.toFixed(1)} links).
    `;
  }).reduce((as, a) => `${as} ${a}`),
);
