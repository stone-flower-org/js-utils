import { Constructor } from '@/src/core';
import { ListenerFunc } from '@/src/events';

import { IPriorityEventBus, PriorityEventBus } from './priority-event-bus';

export interface IPriorityEventProducer extends Omit<IPriorityEventBus, 'emit' | 'emitWherePriority'> {}

export type IWithPriorityEventProducer<T = object> = IPriorityEventProducer & T;

export const WithPriorityEventProducer = <S extends Constructor>(superclass: S) =>
  class extends superclass {
    _priorityEventBus = new PriorityEventBus();

    on(event: string, priority: number, listener: ListenerFunc) {
      return this._priorityEventBus.on(event, listener, priority);
    }

    off(event: string, listener: ListenerFunc) {
      this._priorityEventBus.off(event, listener);
    }

    removeAllListeners() {
      this._priorityEventBus.removeAllListeners();
    }
  };
