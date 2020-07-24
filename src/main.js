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
  inData.chain.pitch,
  inData['bottom bracket'].width,
  inData.dropouts.distance,
  inData.dropouts.thickness,
  inData.chainstay.offset,
);

const chainProps = chain.chainProperties(calc);

// users may or may not provide an actual drivetrain length
// if it is missing we calculate it from frame geometry,
// it is typically between 1 mm and 2 mm shorter than chainstay length
const lDrivetrain = (inData.drivetrain && inData.drivetrain.length)
  || calc.drivetrainLength(
    inData.chainstay.length,
  );

// calculate chain length
const chainLengthResult = inData.chainring.teeth
  .map(m => inData.cog.teeth.map(n => chainProps(lDrivetrain)(m, n)))
  .flat();

// output

out.prose(
  `The bike's drivetrain is ${format.show.mm(lDrivetrain)} long.`,
);

out.prose(
  chainLengthResult
    .map(o => format.chainLengthProse(o))
    .reduce((as, a) => `${as} ${a}`),
);

out.slack(
  format.slackMatrix(chainLengthResult),
);
