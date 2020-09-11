// A class that provides object that store result data
// and provides methods to return this data in useful formats
//
const filterGearSet = o => {
  const keys = Object.keys(o);
  return keys.includes('nRing') && keys.includes('nCog');
};
class Results {
  constructor(nRings, nCogs, lDrivetrain) {
    // arrays with chainrings and cog teeth counts
    this.nRings = nRings;
    this.nCogs = nCogs;

    // distance between centres of chainring and cog
    this.lDrivetrain = lDrivetrain;

    // the gearSets
    this.gearSets = [];
    this.speedSets = [];
  }

  set addGearSet(objs) {
    // input objects need to have nRing and nCog properties
    this.gearSets = [
      ...this.gearSets,
      ...objs.filter(filterGearSet),
    ];
  }

  set addSpeedSet(objs) {
    this.speedSets = [
      ...this.speedSets,
      ...objs.filter(filterGearSet),
    ];
  }
}

module.exports = Results;
