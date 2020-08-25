// calc is an object of Calc class in calc.js, created with closures to
// include some default values
// chainProperties :: Object -> Float -> ( Int, Int ) -> Object
const chainProperties = calc => lDrivetrain => (nChainring, nCog) => {
  const lChain = calc.chainLength(nChainring, nCog, lDrivetrain);
  const nChain = calc.chainLengthToN(lChain);
  const lRestChain = calc.chainLengthRest(lChain);
  const lRestLinks = calc.chainRestLinks(lRestChain);
  return {
    nChainring, nCog, lChain, nChain, lRestChain, lRestLinks,
  };
};

module.exports = {chainProperties};
