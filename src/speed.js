// speed calculation

const fSpeed = r => c => (nC, nR) => 2 * Math.PI * r * c * (nR / nC);

class Speed {
  constructor(lRadiusTyre) {
    this.speed = fSpeed(lRadiusTyre);
  }
}

module.exports = Speed;
