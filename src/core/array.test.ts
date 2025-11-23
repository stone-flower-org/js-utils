import { vi } from 'vitest';

import {
  areArraysEqual,
  areArraysShallowlyEqual,
  binaryFind,
  binaryFindIndex,
  binaryInsert,
  insert,
  range,
} from './array';
import { defaultComparator } from './function';

const obj = {};

const makeBinarySeachPredicator = (search: number) => (val: number) => {
  if (val === search) return 0;
  return search > val ? 1 : -1;
};

describe('range', () => {
  describe.each([
    {
      from: 0,
      to: 0,
      generated: [0],
    },
    {
      from: 1,
      to: 3,
      generated: [1, 2, 3],
    },
    {
      from: -1,
      to: 1,
      generated: [-1, 0, 1],
    },
    {
      from: 0,
      to: -1,
      generated: [],
    },
  ])('should call generator funciton with given numbers range and return generated numbers array', ({
    from,
    to,
    generated,
  }) => {
    it(`from: ${from}, to: ${to}, generated: ${JSON.stringify(generated)}`, () => {
      const generatorMock = vi.fn().mockImplementation((number: number) => number);
      expect(range(from, to, generatorMock)).toEqual(generated);
      expect(generatorMock).toHaveBeenCalledTimes(generated.length);
      generated.forEach((number, i) => {
        expect(generatorMock).toHaveBeenNthCalledWith(i + 1, number);
      });
    });
  });
});

describe('areArraysEqual', () => {
  describe.each([
    {
      name: 'return true when arrays are empty',
      a: [],
      b: [],
      comparator: undefined,
      expectedResult: true,
    },
    {
      name: 'return false when arrays have different size',
      a: [1],
      b: [1, 2],
      comparator: undefined,
      expectedResult: false,
    },
    {
      name: 'use shallow comparator by default',
      a: [1, 2, obj],
      b: [1, 2, obj],
      comparator: undefined,
      expectedResult: true,
    },
    {
      name: 'return true when comparator returns 0 for all values',
      a: [1, 2, obj],
      b: [1, 2, obj],
      comparator: () => 0,
      expectedResult: true,
    },
    {
      name: 'return false when comparator returns non 0 for any value',
      a: [1, 2, obj],
      b: [1, 2, obj],
      comparator: () => -1,
      expectedResult: false,
    },
  ])('should return true when 2 arrays are equal based on given comparator', ({
    name,
    a,
    b,
    comparator,
    expectedResult,
  }) => {
    it(`${name}`, () => {
      expect(areArraysEqual(a, b, comparator)).toBe(expectedResult);
    });
  });
});

describe.each([
  {
    a: [],
    b: [],
    result: true,
  },
  {
    a: ['str'],
    b: ['str'],
    result: true,
  },
  {
    a: ['str'],
    b: ['other str'],
    result: false,
  },
  {
    a: ['str'],
    b: ['str', 'other str'],
    result: false,
  },
  {
    a: ['other str', 'str'],
    b: ['str', 'other str'],
    result: false,
  },
  {
    a: [obj],
    b: [obj],
    result: true,
  },
  {
    a: [{}],
    b: [{}],
    result: false,
  },
])('areArraysShallowlyEqual', ({ a, b, result }) => {
  it(`a: ${JSON.stringify(a)}, b: ${JSON.stringify(b)}, result: ${String(result)}`, () => {
    expect(areArraysShallowlyEqual(a, b)).toBe(result);
  });
});

describe('binaryFindIndex', () => {
  describe.each([
    ...[1, 2, 3, 4, 5].map((val, index, arr) => ({
      arr,
      predicate: makeBinarySeachPredicator(val),
      result: index,
    })),
    ...[1, 2, 3, 4, 5, 6].map((val, index, arr) => ({
      arr,
      predicate: makeBinarySeachPredicator(val),
      result: index,
    })),
    {
      arr: [1, 2, 3],
      predicate: makeBinarySeachPredicator(4),
      result: -1,
    },
  ])('should find index by value', ({ arr, predicate, result }) => {
    it(`index: ${result}, array: ${JSON.stringify(arr)}`, () => {
      expect(binaryFindIndex(arr, predicate)).toBe(result);
    });
  });
});

describe('binaryFind', () => {
  describe.each([
    ...[1, 2, 3].map((val, _, arr) => ({
      arr,
      predicate: makeBinarySeachPredicator(val),
      result: val,
    })),
    {
      arr: [1, 2, 3],
      predicate: makeBinarySeachPredicator(4),
      result: undefined,
    },
  ])('should find value', ({ arr, predicate, result }) => {
    it(`val: ${result}, array: ${JSON.stringify(arr)}`, () => {
      expect(binaryFind(arr, predicate)).toBe(result);
    });
  });
});

describe.each([
  {
    testCase: 'insert at negative index',
    arr: [1, 2, 3],
    index: -1,
    items: [4, 5],
    result: [1, 2, 4, 5, 3],
  },
  {
    testCase: 'insert at certain index',
    arr: [1, 2, 3],
    index: 1,
    items: [4, 5],
    result: [1, 4, 5, 2, 3],
  },
  {
    testCase: 'insert out of array',
    arr: [1, 2, 3],
    index: 3,
    items: [4, 5],
    result: [1, 2, 3, 4, 5],
  },
])('insert', ({ testCase, arr, index, items, result }) => {
  it(`should insert items at certain position, case: ${testCase}`, () => {
    const copy = [...arr];
    insert(copy, index, ...items);
    expect(copy).toEqual(result);
  });
});

describe('binaryInsert', () => {
  describe.each([
    ...[0, 1, 2, 3, 4, 5, 6].map((item) => ({
      arr: [1, 3, 5],
      item,
      comparator: defaultComparator,
      result: [1, 3, 5, item].sort(defaultComparator),
    })),
  ])('should insert new item in sorted array', ({ arr, item, comparator, result }) => {
    it(`arr: ${arr}, item: ${item}, result: ${result}`, () => {
      const copy = [...arr];
      binaryInsert(copy, comparator, item);
      expect(copy).toEqual(result);
    });
  });
});
