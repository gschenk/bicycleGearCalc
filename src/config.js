const tools = require('./tools.js');

const {zipWith, pureSwitch, matchSwitch} = tools;
// check command line arguments
// This function has SIDE EFFECTS (exit with error)!
// returns an object with two keys, stdin and file

// object with f to check validity of cli arguments


const validity = {
  tests: (maxArgs, knownArgsObject) => {
    const bla = {
      // notTooMany :: [String] -> Boolean
      notTooMany: (n => as => as.length <= n)(maxArgs),

      // knownArguments :: [String] -> Boolean
      knownArguments: (o => as => {
        const fun = matchSwitch(o)(false)(a => b => a.endsWith(b));
        return as.map(a => fun(a) !== false).every(a => a);
      })(knownArgsObject),
    };
    return bla;
  },
  errorCases: {
    notTooMany: {err: 7}, // E2BIG
    knownArguments: {err: 22}, // EINVAL
  },
};


// makeBadReturn :: [s] -> [a] -> { s: a } -> { s: a }
const makeBadReturn = (errKeys, errResults, errCases) => () => {
  const defaultErr = {err: 22}; // EINVAL
  const failedKeys = zipWith((a, b) => (!a ? b : ''))(errResults)(errKeys);
  const filterdFailedKeys = failedKeys.filter(a => a);

  return filterdFailedKeys.length === 1
    ? pureSwitch(errCases)(defaultErr)(filterdFailedKeys[0])
    : defaultErr;
};


// makeGoodReturn ::
// String s => { s, s } -> { s, a } -> (s -> { s, { s, a } }) -> s -> { s, a }
const makeGoodReturn = (knownArgs, cases) => args => {
  const defaultCase = { };

  const matcher = arg => {
    const argMatch = matchSwitch(knownArgs)('')(a => b => a.endsWith(b))(arg);
    return pureSwitch(cases(arg))(defaultCase)(argMatch);
  };

  const returnCasesArray = args.map(matcher);
  return returnCasesArray.length > 0
    ? returnCasesArray.reduce((o, a) => ({...o, ...a}))
    : defaultCase;
};


// Takes an object that contains some keys that are
// a subset of the keys of the second argument.
// Returns an object with all keys in the first object
// with values from the first overriding the second
// consolidateReturn :: Object -> Object -> Object
const consolidateReturn = (parts, defaults) => {
  const partsKeys = Object.keys(parts);
  const defaultKeys = Object.keys(defaults);
  const keysIncluded = defaultKeys.map(a => partsKeys.includes(a));

  // reducer :: {a} -> {b} -> {a, b}
  const reducer = (o, a) => ({...o, ...a});

  // zipper :: String s, Bool b => {s: a} -> {s: a} -> s -> b -> a
  const zipper = (oTrue, oFalse) => (a, b) => (b
    ? {[a]: oTrue[a]}
    : {[a]: oFalse[a]});

  return tools.zipWith(
    zipper(parts, defaults),
  )(defaultKeys)(keysIncluded).reduce(reducer);
};


// Takes CLI arguments (argv) and checks them against a dictionary of
// known parameters `knownCliArguments`. Objects from `argumentReturn`
// matching to the CLI arguments found are collated into the returned object.
// Default arguments may be returned otherwise, they are provided in
// `defaultReturn`.
// In case of errors there are no exceptions thrown but error objects returned.
// These may be acted upon at the place of call of this function.
// *This function is pure.*
// args.getConfig :: String s => [s] -> {s: a} -> {s: s} -> {s: a} -> {s: a}
function Config(fullArgs, defaultReturn, knownCliArguments, argumentReturns) {
  // the first two elements, node binary and source path, are not needed
  const args = fullArgs.slice(2);
  Object.freeze(args);

  // apply all tests in validityTests object on args
  const tests = validity.tests(2, knownCliArguments);
  const testsKeys = Object.keys(tests);
  const testsResults = testsKeys.map(a => tests[a](args));

  const badReturn = makeBadReturn(testsKeys,
    testsResults,
    validity.errorCases);

  const goodReturn = makeGoodReturn(knownCliArguments, argumentReturns);

  const preReturn = testsResults.every(a => a)
    ? goodReturn(args)
    : badReturn(args);

  return consolidateReturn(preReturn, defaultReturn);
}

module.exports = Config;
