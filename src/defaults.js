// defines default configuration and CLI arguments

const defaultCfg = {
  err: 0,
  stdin: false,
  verbose: false,
  help: false,
  templates: {
    input: './templates/input.complete.yml',
    inputDefaults: './templates/input.defaults.yml',
  },
  file: './templates/input.defaults.yml',
  prose: true,
  links: false,
  slack: false,
};

// argument flags are mapped to these
// config settings
const configForArg = arg => ({
  stdin: {stdin: true, file: ''},
  file: {file: arg},
  verbose: {verbose: true},
  help: {help: true},
  prose: {prose: true},
  links: {links: true, prose: false},
  slack: {slack: true, prose: false},
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
  '--prose': 'prose', // output results in full sentences
  '--links': 'links', // output of yaml formated number of links in chain
  '--slack': 'slack', // output of yaml formated slack in chain
};

module.exports = {
  defaultCfg,
  knownCliArguments,
  configForArg,
};
