import { createSubscriptionForEventBus, EventBus } from '@/src/events';

export type ProgressSubscribeArgs = [Progress];

export interface ProgressOptions {
  totalSteps: number;
  step: number;
}

export interface IProgress extends Omit<Progress, 'create'> {}

export const DEFAULT_PROGRESS_OPTIONS = {
  totalSteps: 1,
  step: 0,
};

// TODO: update tests
export class Progress {
  _eventBus = EventBus.create();
  _options: ProgressOptions;

  static create(options: Partial<ProgressOptions> = {}) {
    return new this(options);
  }

  constructor(options: Partial<ProgressOptions> = {}) {
    this._options = {
      ...DEFAULT_PROGRESS_OPTIONS,
      ...options,
    };
    if (this._options.step < 0 || this._options.step > this._options.totalSteps)
      throw new Error('provided step must be between 0 and totalSteps');
  }

  advance(_step = 1) {
    this._options.step = Math.min(this._options.totalSteps, this._options.step + _step);
    this._eventBus.emit('change', this);
  }

  retreat(_step = 1) {
    this._options.step = Math.max(0, this._options.step - _step);
    this._eventBus.emit('change', this);
  }

  finish() {
    this._options.step = this._options.totalSteps;
    this._eventBus.emit('change', this);
  }

  reset() {
    this._options.step = 0;
    this._eventBus.emit('change', this);
  }

  isFinished() {
    return this._options.step === this._options.totalSteps;
  }

  getProgress() {
    return this._options.step / this._options.totalSteps;
  }

  getStep() {
    return this._options.step;
  }

  getTotalSteps() {
    return this._options.totalSteps;
  }

  subscribe = createSubscriptionForEventBus<ProgressSubscribeArgs>(this._eventBus, 'change');
}
