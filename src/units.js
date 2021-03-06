// identify units and convert them into SI base units and rad
const deepFreeze = require('deep-freeze');
const constants = require('./constants');

const length = {
  // keys: unit symbol
  // values: factor to convert to units of 1 m
  values: {
    m: 1,
    nm: 1e-9,
    um: 1e-6,
    mm: 1e-3,
    cm: 1e-2,
    dm: 1e-1,
    km: 1e3,
    Mm: 1e6,
    Gm: 1e9,
    in: 0.0254,
    thou: 0.254e-3,
    s: constants.c, // light seconds
    NM: 1852, // mile
    mi: 1.609344, // international mile
  },
  translations: {
    μm: 'um',
    micron: 'um',
    mil: 'thou',
    nmi: 'NM',
  },
};
deepFreeze(length);

const mass = {
  values: {
    kg: 1,
    ng: 1e-12,
    ug: 1e-9,
    mg: 1e-6,
    g: 1e-3,
    Mg: 1e3,
    Gg: 1e6,
  },
  translations: {
    μg: 'ug',
    t: 'Mg',
  },
};
deepFreeze(mass);

const force = {
  // keys: unit symbol
  // values: factor to convert to units of 1 N
  values: {
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
  translations: {
    μN: 'uN',
    g: 'gf',
    kg: 'kp',
    kgf: 'kp',
    lb: 'lbf',
    dyne: 'dyn',
  },
};
deepFreeze(force);

const angle = {
  // keys: unit symbol
  // values: factor to convert to units of 1 kg
  values: {
    rad: 1,
    deg: Math.PI / 180,
    mrad: 1e3,
  },
  translations: {
    mil: 'mrad',
  },
};
deepFreeze(angle);

const frequency = {
  // keys: unit symbol
  // values: factor to convert to units of 1 Hz
  values: {
    Hz: 1,
    kHz: 1e3,
    MHz: 1e6,
    GHz: 1e9,
    rpm: 1 / 60,
    rph: 1 / 3600,
  },
  translations: {
    's^-1': 'Hz',
    '/s': 'Hz',
    '1/s': 'Hz',
    rps: 'Hz',
    '1/min': 'rpm',
  },
};

const velocity = {
  values: {
    'm/s': 1,
    c: 299792458,
    'km/h': 10 / 36,
    kt: length.values.NM / 3600,
    mph: length.values.mi / 3600,
  },
  translations: {
    mps: 'm/s',
    kph: 'km/h',
    KPH: 'km/h',
    'NM/h': 'kt',
    MPH: 'mph',
    'mi/h': 'mph',
    'nmi/h': 'kt',
  },
};

const number = {
  values: {},
  translations: {},
};
deepFreeze(number);

const text = {
  values: {},
  translations: {},
};
deepFreeze(text);

// there is no unambiguous meaning for these unit symbols
const ambiguous = ['Mi', 'Oz', 'gr', 'mi', 'M'];

module.exports = {
  length, mass, force, angle, frequency, velocity, ambiguous,
};
