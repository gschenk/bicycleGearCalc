const Config = require('./config');
const defaults = require('./defaults');
const tools = require('./tools');
const units = require('./units');
const read = require('./read');
const Input = require('./input');
const Output = require('./output');
const Format = require('./format');
const Calc = require('./calc');
const chain = require('./chain');

// putting configuration object together
const config = new Config(
  process.argv,
  defaults.defaultCfg,
  defaults.knownCliArguments,
  defaults.configForArg,
);
Object.freeze(config);

// config provides closures that toggle output functions
const out = new Output(config);

// outputs can be formated with these tools
const format = new Format(units);

out.verbose('Config', config);

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

out.verbose(inData);

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
  console.log(format.help(defaults.knownCliArguments));
  process.exit(0);
  console.log(
    'where .yaml and .yml denote any input file, including path, with that end.',
  );
}

// calculations
// new calc object, created with some closures on
// some constant values
const calc = new Calc(
  inData.drivetrain.length,
  inData.chain.pitch,
  inData.chain.wear,
  inData.chainring.wear,
  inData.cog.wear,
);

const chainProps = chain.chainProperties(calc);

// calculate chain length
const chainLengthResult = inData.chainring.teeth
  .map(m => inData.cog.teeth.map(n => chainProps(m, n)))
  .flat();

// output

out.prose(
  `The bike's drivetrain is ${format.show.mm(inData.drivetrain.length)} long.`,
);

out.prose(
  chainLengthResult
    .map(o => format.chainLengthProse(o))
    .reduce((as, a) => `${as} ${a}`),
);

out.links(format.linksMatrix(chainLengthResult));

out.slack(format.slackMatrix(chainLengthResult));
