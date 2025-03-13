export enum RoundType {
  DOWN,
  UP,
  HALF_UP,
  HALF_DOWN,
}

export interface RoundOptions {
  precision?: number;
  type?: RoundType;
}

const ROUND_BY_TYPE = {
  [RoundType.DOWN]: Math.floor,
  [RoundType.UP]: Math.ceil,
  [RoundType.HALF_DOWN]: (val: number) => -Math.round(-val),
  [RoundType.HALF_UP]: Math.round,
};

export const round = (val: number, { precision = 0, type = RoundType.HALF_UP }: RoundOptions = {}) => {
  precision = precision < 0 ? 0 : precision;
  const mul = 10 ** precision;
  return ROUND_BY_TYPE[type](val * mul) / mul;
};

// TODO: write tests
export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

// TODO: write tests
export const map = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

// TODO: write tests
export const mapNClamp = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  clamp(map(val, inMin, inMax, outMin, outMax), outMin, outMax);

// TODO: write tests
export const loop = (val: number, min: number, max: number) => {
  const dist = max - min + 1;
  const i = Math.floor((val - min) / dist);
  return val - i * dist;
};

// TODO: write unit tests
export const randomBetween = (from: number, to: number) => from + Math.floor(Math.random() * (to - from + 1));
