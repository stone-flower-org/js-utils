import { RoundType, round } from './number';

describe('round', () => {
  describe.each([
    ...[
      {
        value: 1.4,
        expectedResult: 1,
      },
      {
        value: 1.5,
        expectedResult: 2,
      },
      {
        value: 1.6,
        expectedResult: 2,
      },
    ].map((params, i) => ({
      name: `round using half up with 0 precision when precision and type are undefined ${i}`,
      precision: undefined,
      type: undefined,
      ...params,
    })),

    ...[
      {
        value: 1.44,
        expectedResult: 1.4,
      },
      {
        value: 1.45,
        expectedResult: 1.5,
      },
      {
        value: 1.46,
        expectedResult: 1.5,
      },
    ].map((params, i) => ({
      name: `round using half up with 1 precision when precision is 1 and type is HALF_UP ${i}`,
      precision: 1,
      type: RoundType.HALF_UP,
      ...params,
    })),

    ...[
      {
        value: 1.4444444,
        expectedResult: 1.444444,
      },
      {
        value: 1.4444445,
        expectedResult: 1.444445,
      },
      {
        value: 1.4444446,
        expectedResult: 1.444445,
      },
    ].map((params, i) => ({
      name: `round using half up with 6 precision when precision is 6 and type is HALF_UP ${i}`,
      precision: 6,
      type: RoundType.HALF_UP,
      ...params,
    })),

    ...[
      {
        value: 1.4,
        expectedResult: 1,
      },
      {
        value: 1.5,
        expectedResult: 1,
      },
      {
        value: 1.6,
        expectedResult: 2,
      },
    ].map((params, i) => ({
      name: `round using half down with 0 precision when precision is 0 and type is HALF_DOWN ${i}`,
      precision: 0,
      type: RoundType.HALF_DOWN,
      ...params,
    })),

    ...[
      {
        value: 1.4,
        expectedResult: 2,
      },
      {
        value: 1.5,
        expectedResult: 2,
      },
      {
        value: 1.6,
        expectedResult: 2,
      },
    ].map((params, i) => ({
      name: `round using half down with 0 precision when precision is 0 and type is UP ${i}`,
      precision: 0,
      type: RoundType.UP,
      ...params,
    })),

    ...[
      {
        value: 1.4,
        expectedResult: 1,
      },
      {
        value: 1.5,
        expectedResult: 1,
      },
      {
        value: 1.6,
        expectedResult: 1,
      },
    ].map((params, i) => ({
      name: `round using half down with 0 precision when precision is 0 and type is DOWN ${i}`,
      precision: 0,
      type: RoundType.DOWN,
      ...params,
    })),
  ])('should round given number with provided precision and rounding type', ({
    name,
    value,
    precision,
    type,
    expectedResult,
  }) => {
    it(`${name}`, () => {
      expect(round(value, { precision, type })).toBe(expectedResult);
    });
  });
});
