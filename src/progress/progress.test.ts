import { vi } from 'vitest';

import { Progress } from './progress';

describe('createProgress', () => {
  it('should return Progress instance', () => {
    expect(Progress.create()).toBeInstanceOf(Object);
  });

  it('should throw error when provided step is less than 0', () => {
    const options = {
      step: -1,
    };
    expect(() => Progress.create(options)).toThrow('provided step must be between 0 and totalSteps');
  });

  it('should throw error when provided step is greater than totalSteps', () => {
    const options = {
      totalSteps: 10,
      step: 11,
    };
    expect(() => Progress.create(options)).toThrow('provided step must be between 0 and totalSteps');
  });

  describe('Progress', () => {
    describe('advance', () => {
      describe.each([
        {
          name: 'should increase current step by 1 when step is undefined',
          options: {
            step: 0,
            totalSteps: 10,
          },
          value: undefined,
          expectedResult: 1,
        },
        {
          name: 'should increase current step by 5 when step is 5',
          options: {
            step: 0,
            totalSteps: 10,
          },
          value: 5,
          expectedResult: 5,
        },
        {
          name: 'should not exceed totalSteps',
          options: {
            step: 0,
            totalSteps: 10,
          },
          value: 11,
          expectedResult: 10,
        },
      ])('should increase current step by provided step', ({ name, options, value, expectedResult }) => {
        it(`${name}`, () => {
          const progress = Progress.create(options);
          progress.advance(value);
          expect(progress.getStep()).toBe(expectedResult);
        });
      });

      it('should call subscriber after call', () => {
        const subscriber = vi.fn();
        const progress = Progress.create();
        progress.subscribe(subscriber);

        progress.advance();

        expect(subscriber).toHaveBeenCalledWith(progress);
      });
    });

    describe('retreat', () => {
      describe.each([
        {
          name: 'should decrease current step by 1 when provided step is undefined',
          options: {
            step: 2,
            totalSteps: 10,
          },
          value: undefined,
          expectedResult: 1,
        },
        {
          name: 'should decrease current step by 5 when provided step is 5',
          options: {
            step: 6,
            totalSteps: 10,
          },
          value: 5,
          expectedResult: 1,
        },
        {
          name: 'should not exceed 0',
          options: {
            step: 10,
            totalSteps: 10,
          },
          value: 11,
          expectedResult: 0,
        },
      ])('should decrease current step by provided step', ({ name, options, value, expectedResult }) => {
        it(`${name}`, () => {
          const progress = Progress.create(options);
          progress.retreat(value);
          expect(progress.getStep()).toBe(expectedResult);
        });
      });

      it('should call subscribers after call', () => {
        const subscriber = vi.fn();
        const progress = Progress.create();
        progress.subscribe(subscriber);

        progress.retreat();

        expect(subscriber).toHaveBeenCalledWith(progress);
      });
    });

    describe('finish', () => {
      it('should set step from provided totalSteps option after call', () => {
        const options = {
          totalSteps: 100,
        };
        const progress = Progress.create(options);
        progress.finish();
        expect(progress.getStep()).toBe(options.totalSteps);
      });

      it('should call subscriber after call', () => {
        const subscriber = vi.fn();
        const progress = Progress.create();
        progress.subscribe(subscriber);

        progress.finish();

        expect(subscriber).toHaveBeenCalledWith(progress);
      });
    });

    describe('reset', () => {
      it('should set 0 step after call', () => {
        const options = {
          step: 1,
        };
        const progress = Progress.create(options);
        progress.reset();
        expect(progress.getStep()).toBe(0);
      });

      it('should call subscriber after call', () => {
        const subscriber = vi.fn();
        const progress = Progress.create();
        progress.subscribe(subscriber);

        progress.reset();

        expect(subscriber).toHaveBeenCalledWith(progress);
      });
    });

    describe('isFinished', () => {
      describe.each([
        {
          name: 'step == totalSteps',
          options: {
            step: 1,
            totalSteps: 1,
          },
          expectedResult: true,
        },
        {
          name: 'step != totalSteps',
          options: {
            step: 0,
            totalSteps: 1,
          },
          expectedResult: false,
        },
      ])('should return true when step is equal to totalSteps', ({ name, options, expectedResult }) => {
        it(`${name}`, () => {
          const progress = Progress.create(options);
          expect(progress.isFinished()).toBe(expectedResult);
        });
      });
    });

    describe('getProgress', () => {
      it('should return step/totalSteps ratio', () => {
        const options = {
          step: 1,
          totalSteps: 10,
        };
        const progress = Progress.create(options);
        expect(progress.getProgress()).toBe(options.step / options.totalSteps);
      });
    });

    describe('getStep', () => {
      it('should return current step', () => {
        const options = {
          step: 0,
          totalSteps: 10,
        };
        const progress = Progress.create(options);
        progress.advance();
        expect(progress.getStep()).toBe(options.step + 1);
      });
    });

    describe('getTotalSteps', () => {
      it('should return total steps', () => {
        const options = {
          totalSteps: 100,
        };
        const progress = Progress.create(options);
        expect(progress.getTotalSteps()).toBe(options.totalSteps);
      });
    });
  });
});
