// speed calculation

// effective radius of wheel
const rEff = (lBead, lTyre, nDep) => lBead / 2 + lTyre * (1 - nDep);

// speed for a given cadence
const fSpeed = r => c => (nRing, nCog) => nCog !== 0
  ? 2 * Math.PI * r * c * (nRing / nCog)
  : NaN;

// equivalent wheel size at 1:1 gearing
const fEquivWheel = r => (nCog, nRing) => nCog !== 0
  ? r * (nRing / nCog)
  : NaN;

class Speed {
  constructor(
    lBead, // bead diametre of the wheel
    lTyre, // nominal width of tyre, assumption width = height
    nDepression, // how much tyre gets depressed by rider
  ) {
    const rWheel = rEff(lBead, lTyre, nDepression);
    this.speed = fSpeed(rWheel);
    this.speedSet = nCadence => (nRing, nCog) => ({
      nRing,
      nCog,
      cadence: nCadence,
      speed: fSpeed(rWheel)(nCadence)(nRing, nCog),
    });
    this.gearInches = fEquivWheel(rWheel);
  }
}

module.exports = Speed;
