// const lChain = calc.naiveChainLength(inData.chainring.teeth[0], inData.cog.teeth[0],
//   inData.drivetrain.length);
//   calc is an object of Calc class in calc.js, created with closures to include some
//   default values
//   chainProperties :: Object -> Float -> ( Int, Int ) -> Object
const chainProperties = calc => lDrivetrain => (nChainring, nCog) => {
  const lChain = calc.naiveChainLength(nChainring, nCog, lDrivetrain);
  const nChain = calc.chainLengthToN(lChain);
  const lRestChain = calc.chainLengthRest(lChain);
  const lRestLinks = calc.chainRestLinks(lRestChain);
  return {
    nChainring, nCog, lChain, nChain, lRestChain, lRestLinks,
  };
};

module.exports = {chainProperties};
