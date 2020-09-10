// A class that provides object that store result data
// and provides methods to return this data in useful formats
//
class Results {
  constructor(nRings, nCogs, lDrivetrain) {
    // arrays with chainrings and cog teeth counts
    this.nRings = nRings;
    this.nCogs = nCogs;

    // distance between centres of chainring and cog
    this.lDrivetrain = lDrivetrain;

    // the gearSets
    this.gearSets = [];
  }

  set addGearSet(objs) {
    // input objects need to have nRing and nCog properties
    this.gearSets = [
      ...this.gearSets,
      ...objs.filter(o => {
        const keys = Object.keys(o);
        return keys.includes('nRing') && keys.includes('nCog');
      }),
    ];
  }
}

module.exports = Results;
