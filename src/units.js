// identify units and convert them into SI base units and rad
const deepFreeze = require('deep-freeze');
const constants = require('./constants');

const values = {
  // keys: unit symbol
  // values: factor to convert to units of 1 m
  length: {
    m: 1,
    nm: 1e-9,
    um: 1e-6,
    mm: 1e-3,
    cm: 1e-2,
    dm: 1e-1,
    km: 1e3,
    Mm: 1e6,
    Gm: 1e9,
    in: 0.254,
    thou: 0.254e-3,
    s: constants.c, // light seconds
    NM: 1852, // mile
  },

  // keys: unit symbol
  // values: factor to convert to units of 1 kg
  mass: {
    kg: 1,
    ng: 1e-12,
    ug: 1e-9,
    mg: 1e-6,
    g: 1e-3,
    Mg: 1e3,
    Gg: 1e6,
  },

  // keys: unit symbol
  // values: factor to convert to units of 1 N
  force: {
    N: 1,
    uN: 1e-6,
    mN: 1e-3,
    kN: 1e3,
    daN: 10, // decanewton
    dyn: 1e-5,
    kdyn: 1e-2,
    kp: constants.g,
    Mp: 1e3 * constants.g,
    gf: 1e-3 * constants.g,
    lbf: 4.448222,
  },

  angle: {
    rad: 1,
    deg: Math.PI / 180,
    mrad: 1e3,
  },
};
deepFreeze(values);

const translation = {
  length: {
    μm: 'um',
    micron: 'um',
    mil: 'thou',
    nmi: 'NM',
  },
  mass: {
    μg: 'ug',
    t: 'Mg',
  },
  force: {
    μN: 'uN',
    g: 'gf',
    kg: 'kp',
    kgf: 'kp',
    lb: 'lbf',
    dyne: 'dyn',
  },
  angle: {
    mil: 'mrad',
  },
};
deepFreeze(translation);


// there is no unambiguous meaning for these unit symbols
const ambiguous = ['Mi', 'Oz', 'gr', 'mi', 'M'];


module.exports = {
  values, translation, ambiguous,
};
