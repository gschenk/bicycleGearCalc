// zipWith takes two arrays and applies a function element wise
// zipWith :: ( a -> b -> c ) -> [a] -> [b] -> [c]
const zipWith = f => xs => ys => xs.map((n, i) => f(n, ys[i]));

const tools = {
// this is a convenient replacement for switch
  // pureSwitch :: String a => { a: b } -> b -> a -> b
  pureSwitch: cases => defCase => key => {
    const hasProperty = o => s => Object.keys(o).includes(s);
    return hasProperty(cases)(key) ? cases[key] : defCase;
  },

  // this is a convenient replacement for switch
  // pureSwitch :: String a, Bool b => {a: c} -> c -> ( a -> a -> b ) -> a -> b
  matchSwitch: cases => defCase => fun => str => {
    // keys :: [String]
    const keys = Object.keys(cases);

    // matcher :: String a, Bool b =>  [a] -> ( a -> a -> b ) -> a -> [b]
    const matcher = as => f => s => as.map(f(s));
    const match = matcher(keys)(fun)(str);

    // keyToMatch :: [String] -> [Bool] -> String;
    const keyToMatch = as => bs => zipWith((a, b) => (b ? a : ''))(as)(bs);

    // key :: String
    const key = keyToMatch(keys)(match).filter(c => (c)).join('');
    const uniqeMatch = match.filter(a => (a)).length === 1;
    return uniqeMatch ? cases[key] : defCase;
  },

  zipWith,
};

module.exports = tools;
