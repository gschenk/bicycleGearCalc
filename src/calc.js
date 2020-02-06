// returns radius of cog or chainring in [m]
// calcSprocketRadius :: Float -> Integer -> Float
const sprocketRadius = lPitch => nTeeth => (nTeeth * lPitch) / (2 * Math.PI);

// returns the angle [rad] at which the chain joins the chainring
// chainJoinAngle :: Float -> Float -> Float -> Float
const chainJoinAngle = (rChainring, rCog, lDrivetrain) => Math.acos(
  (rCog - rChainring) / lDrivetrain,
);

// returns the straight line between points of cog separation and chainring join
// upFreeChainLength :: Float -> Float -> Float -> Float
const upFreeChainLength = (rChainring, rCog, lDrivetrain) => Math.sqrt(
  (rChainring - rCog) ** 2 + lDrivetrain ** 2,
);

// returns evolvement of a cog/chainring by the chain
const chainEvolvement = (rC, aSep) => 2 * (aSep / Math.PI) * rC;

// returns the length of chain for a perfectly taut chain wit no errors
// naiveChainLength :: Float -> Integer -> Integer -> Float -> Float
const naiveChainLength = lPitch => (nChainring, nCog, lDrivetrain) => {
  const rChainring = sprocketRadius(lPitch)(nChainring);
  const rCog = sprocketRadius(lPitch)(nCog);

  const aJoin = chainJoinAngle(rChainring, rCog, lDrivetrain);

  const lFreeChain = upFreeChainLength(rChainring, rCog, lDrivetrain);
  const lChainring = chainEvolvement(rChainring, aJoin);
  const lCog = chainEvolvement(rCog, aJoin);

  // assuming: separation angle = aJoin; mirror symetry up/down
  return lChainring + lCog + (2 * lFreeChain);
};

const chainLengthToN = lPitch => lChain => Math.floor(lChain / lPitch);

const chainLengthRest = lPitch => lChain => (lChain % lPitch);

class Calc {
  constructor(lChainPitch) {
    this.naiveChainLength = naiveChainLength(lChainPitch);
    this.chainLengthToN = chainLengthToN(lChainPitch);
    this.chainLengthRest = chainLengthRest(lChainPitch);
    this.chainringRadius = sprocketRadius(lChainPitch);
    this.sprocketRadius = sprocketRadius(lChainPitch);
  }
}

module.exports = Calc;