// A class that provides object that store result data
// and provides methods to return this data in useful formats
//
class Results {
  constructor(nChainrings, nCogs, lDrivetrain) {
    // arrays with chainrings and cog teeth counts
    this.nChainrings = nChainrings;
    this.nCogs = nCogs;

    // distance between centres of chainring and cog
    this.lDrivetrain = lDrivetrain;

    // the chainsets
    this.chainSets = [];
  }

  set addChainSet(objs) {
    // input objects need to have nChainring and nCog properties
    this.chainSets = [
      ...this.chainsets,
      ...objs.filter(o => {
        const keys = Object.keys(o);
        return keys.includes('nChainring') && keys.includes('nCog');
      }),
    ];
  }
}

module.exports = Results;
