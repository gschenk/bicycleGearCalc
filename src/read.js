// reads yaml input file
const yaml = require('js-yaml');
const fs = require('fs');

// Side Effects!
function readFile(inFilePath) {
  // mutable binding to get variable before try scope
  let YmlDoc = {};
  // safeLoad from js-yaml loads one document per yaml file
  try {
    YmlDoc = yaml.safeLoad(fs.readFileSync(inFilePath, 'utf8'));
  } catch (e) {
    console.log(e);
  }
  return YmlDoc;
}

module.exports = {readFile};
