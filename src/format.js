// formats output nicely
const yaml = require('js-yaml');

// formats list of CLI arguments (obj) for help text
function help(obj) {
  return yaml.safeDump(obj);
}

module.exports = {help};
