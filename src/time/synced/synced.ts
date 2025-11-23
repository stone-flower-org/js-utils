import { createContextSaver } from '@/src/context-saver';
import { type Constructor } from '@/src/core';
import { IClock } from '@/src/time/clock';
import { ITick, ITickingClock, TickingClock } from '@/src/time/ticking-clock';

export type IWithSyncedClock<T = object> = {
  syncClock(clock: ITickingClock): void;
} & T;

// biome-ignore lint/suspicious/noExplicitAny: use any args
export const WithSyncedClock = <S extends Constructor<any[], IClock>>(superclass: S) =>
  class extends superclass {
    _syncBinder = createContextSaver(this);
    _syncClock?: ITickingClock;
    _lastTick?: ITick;

    syncClock(clock: ITickingClock) {
      this._setSyncClock(clock);
    }

    delete() {
      this._setSyncClock(undefined);
      super.delete();
    }

    _onTick(tick: ITick) {
      this._lastTick = tick;
    }

    _setSyncClock(clock?: ITickingClock) {
      if (this._syncClock) {
        this._syncClock.off(TickingClock.EVENTS.tick, this._syncBinder.useFunc(this._onTick));
        return;
      }

      this._syncClock = clock;
      this._lastTick = clock?.getLastTick();
      this._syncClock?.on(TickingClock.EVENTS.tick, this._syncBinder.useFunc(this._onTick));
    }

    _now() {
      return this._lastTick?.time ?? 0;
    }
  };
