import { Args, binaryInsert } from '@/src/core';

import { ListenerFunc } from './event-bus';

export type PrioritizedEventListener = [ListenerFunc, number];

export type PriorityCheckFunc = (priority: number) => boolean;

export interface IPriorityEventBus extends Omit<PriorityEventBus, 'create'> {}

export class PriorityEventBus {
  // TODO: replace array with priority queue, reduce from O(n) to O(log(n))
  protected _listenersByEvent = new Map<string, PrioritizedEventListener[]>();

  static create() {
    return new this();
  }

  on(event: string, listener: ListenerFunc, priority: number) {
    let listeners = this._listenersByEvent.get(event) ?? [];
    if (!listeners) {
      listeners = [];
    }
    binaryInsert(listeners, (a, b) => a[1] - b[1], [listener, priority] as const);
    return () => {
      this.off(event, listener);
    };
  }

  off(event: string, listener: ListenerFunc) {
    const listeners = this._listenersByEvent.get(event);
    if (!listeners) return;
    const newListeners = listeners.filter(([usedListener]) => usedListener !== listener);
    this._listenersByEvent.set(event, newListeners);
  }

  emitWherePriority(event: string, checkPriority?: PriorityCheckFunc, ...args: Args) {
    (this._listenersByEvent.get(event) ?? []).forEach(([listener, priority]) => {
      if (checkPriority && !checkPriority(priority)) return;
      listener(...args);
    });
  }

  emit(event: string, ...args: Args) {
    this.emitWherePriority(event, undefined, ...args);
  }

  removeAllListeners() {
    this._listenersByEvent.clear();
  }
}
