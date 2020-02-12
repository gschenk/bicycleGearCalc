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
const chainEvolvement = (rC, aSep) => 2 * aSep * rC;

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

// even number of links in a chain that is greater than a given length
const chainLengthToN = lPitch => lChain => 2 * Math.ceil(lChain / (2 * lPitch));

// rest length chain is longer than minimum
const chainLengthRest = lPitch => lChain => 2 * lPitch - (lChain % (2 * lPitch));

// rest in units of links
const chainRestLinks = lPitch => lRest => lRest !== 0 ? lRest / lPitch : 0;

// at the rear the chainstay is offset from the median plane and thus
// slightly shorter than the drivetrain length. Here this offset is
// approximated to calculate the actual drivetrain length.
const drivetrainLength = (
  lBBWidth,
  lDropoutsDistance,
  lDropoutsThickness,
  lChainstayBBOffset,
) => lChainstay => {
  // lChainstayBBOffset is optional, if not available,
  // 3/8 lBBWidth is a rough approx.
  const lFrontOffset = lChainstayBBOffset || (3 * lBBWidth) / 8;
  const lRearOffset = lDropoutsDistance / 2 - lDropoutsThickness;
  // (i) at the front by about half the BB width
  // [optional parameter, lChainstayBBOffset]
  // and (ii) at the back by half the OLD
  return Math.sqrt(lChainstay ** 2 - (lRearOffset - lFrontOffset) ** 2);
};

class Calc {
  constructor(
    lChainPitch,
    lBBWidth,
    lDropoutsDistance,
    lDropoutsThickness,
    lChainstayBBOffset,
  ) {
    this.naiveChainLength = naiveChainLength(lChainPitch);
    this.chainLengthToN = chainLengthToN(lChainPitch);
    this.chainLengthRest = chainLengthRest(lChainPitch);
    this.chainringRadius = sprocketRadius(lChainPitch);
    this.sprocketRadius = sprocketRadius(lChainPitch);
    this.chainRestLinks = chainRestLinks(lChainPitch);
    this.drivetrainLength = drivetrainLength(
      lBBWidth,
      lDropoutsDistance,
      lDropoutsThickness,
      lChainstayBBOffset,
    );
  }
}

module.exports = Calc;
