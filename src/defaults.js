// defines default configuration and CLI arguments

const defaultCfg = {
  err: 0,
  stdin: false,
  file: './example.yaml',
  verbose: false,
  help: false,
  templates: {
    input: './templates/input.complete.yml',
    inputDefaults: './templates/input.defaults.yml',
  },
};

// argument flags are mapped to these
// config settings
const configForArg = arg => ({
  stdin: {stdin: true, file: ''},
  file: {file: arg},
  verbose: {verbose: true},
  help: {help: true},
});

// dictionary of accepted argument patterns
const knownCliArguments = {
  '.yaml': 'file',
  '.yml': 'file',
  '-': 'stdin',
  '--stdin': 'stdin',
  '-v': 'verbose',
  '--verbose': 'verbose',
  '-h': 'help',
  '--help': 'help',
  '-?': 'help',
};

module.exports = {
  defaultCfg,
  knownCliArguments,
  configForArg,
};
