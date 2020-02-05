const Config = require('./config');
const defaults = require('./defaults');
const tools = require('./tools');
const units = require('./units');
const read = require('./read');
const Input = require('./input');


const config = new Config(
  process.argv,
  defaults.defaultCfg,
  defaults.knownCliArguments,
  defaults.configForArg,
);
Object.freeze(config);


// closure on Data constructor
function InData(dataObject) {
  return new Input(
    read.readFile(config.templates.input),
    units,
    dataObject,
  );
}

const inData = new InData(
  read.readFile(config.templates.inputDefaults),
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
