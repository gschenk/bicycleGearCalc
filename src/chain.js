// calc is an object of Calc class in calc.js, created with closures to
// include some default values
// chainProperties :: Object -> Float -> ( Int, Int ) -> Object
const chainProperties = calc => (nRing, nCog) => {
  const lChain = calc.chainLength(nRing, nCog);
  const nChain = calc.chainLengthToN(lChain);
  const lRestChain = calc.chainLengthRest(lChain);
  const lRestLinks = calc.chainRestLinks(lRestChain);
  return {
    nRing, nCog, lChain, nChain, lRestChain, lRestLinks,
  };
};

module.exports = {chainProperties};
