// Output Class provides functions

// toggleLog :: Function -> Bool -> Function
const conditionalOut = f => b => b ? f : (() => undefined);

// Output's constructor takes an object with the present configuration
class Output {
  constructor(config) {
    this.verbose = conditionalOut(console.log)(config.verbose);
  }
}

module.exports = Output;
