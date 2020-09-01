// returns radius of cog or chainring in [m]
// This is the radius of the circle that circumscribes the polygon
// formed by the chain elements.

// radius of a regular polygon (circumcircle radius)
// polygonRadius :: Float -> Integer -> Float
const polygonRadius = s => n => s / (2 * Math.sin(Math.PI / n));

// calcSprocketRadius :: Float -> Integer -> Float
const sprocketRadius = lPitch => nTeeth => polygonRadius(lPitch)(nTeeth);

// returns the angle [rad] at which the chain joins the chainring
// chainJoinAngle :: Float -> Float -> Float -> Float
const chainJoinAngle = (rChainring, rCog, lDrivetrain) => Math.asin(
  (rChainring - rCog) / lDrivetrain,
);

// returns the straight line between points of cog separation and chainring join
// upFreeChainLength :: Float -> Float -> Float -> Float
const upFreeChainLength = (rChainring, rCog, lDrivetrain) => Math.sqrt(
  lDrivetrain ** 2 - (rChainring - rCog) ** 2,
);

// returns evolvement of a cog/chainring by the chain
// adds circumference of half cog/ring and adds correction for chain angle
const chainEvolvement = (rC, aSep) => (Math.PI + 2 * aSep) * rC;

// only about half the cog or chainring is envolved by the chain
// the chain leaves the cog by the chain separation angle aSep before
// or after the half way point
const evolvedFraction = aSep => 0.5 + aSep / Math.PI;

// returns the length of chain for a perfectly taut chain wit no errors
// naiveChainLength :: Float -> Integer -> Integer -> Float -> Float
const naiveChainLength = (lDrivetrain, lPitch) => (nChainring, nCog) => {
  const rChainring = sprocketRadius(lPitch)(nChainring);
  const rCog = sprocketRadius(lPitch)(nCog);

  // On the upper chainline the chain joins the chainring at angle aJoin
  // from the vertical. It leaves the cog at angle aSep.
  const aJoin = chainJoinAngle(rChainring, rCog, lDrivetrain);
  const aSep = -aJoin;

  const lFreeChain = 2 * upFreeChainLength(rChainring, rCog, lDrivetrain);
  const lChainring = chainEvolvement(rChainring, aJoin);
  const lCog = chainEvolvement(rCog, aSep);

  // assuming: mirror symetry up/down
  return lChainring + lCog + lFreeChain;
};

const chordalChainLength = (
  lDrivetrain,
  lPitch,
  nChainringWear,
  nCogWear,
) => (
  nChainring,
  nCog,
) => {
  // the radii are required for chain geometry
  const rChainring = sprocketRadius(lPitch)(nChainring) * nChainringWear;
  const rCog = sprocketRadius(lPitch)(nCog) * nCogWear;

  const aJoin = chainJoinAngle(rChainring, rCog, lDrivetrain);
  const aSep = -aJoin;

  const lFreeChain = 2 * upFreeChainLength(rChainring, rCog, lDrivetrain);
  const lChainring = evolvedFraction(aJoin) * nChainring * lPitch * nChainringWear;
  const lCog = evolvedFraction(aSep) * nCog * lPitch * nCogWear;

  // assuming: mirror symetry up/down
  return lChainring + lCog + lFreeChain;
};

// even number of links in a chain that is greater than a given length
const chainLengthToN = lPitch => lChain => 2 * Math.ceil(lChain / (2 * lPitch));

// rest length chain is longer than minimum
const chainLengthRest = lPitch => lChain => 2 * lPitch - (lChain % (2 * lPitch));

// rest in units of links
const chainRestLinks = lPitch => lRest => lRest !== 0 ? lRest / lPitch : 0;

class Calc {
  constructor(
    lDrivetrain,
    lChainPitch,
    nChainWear,
    nChainringWear,
    nCogWear,
  ) {
    this.naiveChainLength = naiveChainLength(lDrivetrain, lChainPitch);
    this.chainLength = chordalChainLength(
      lDrivetrain,
      lChainPitch,
      nChainringWear,
      nCogWear,
    );
    this.chainLengthToN = chainLengthToN(lChainPitch * nChainWear);
    this.chainLengthRest = chainLengthRest(lChainPitch * nChainWear);
    this.chainringRadius = sprocketRadius(lChainPitch);
    this.sprocketRadius = sprocketRadius(lChainPitch);
    this.chainRestLinks = chainRestLinks(lChainPitch * nChainWear);
  }
}

module.exports = Calc;
