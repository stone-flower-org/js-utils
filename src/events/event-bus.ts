import { Args } from '@/src/core';

export type ListenerFunc<A extends Args = Args> = (...args: A) => unknown;

export interface IEventBus extends Omit<EventBus, 'create'> {}

export class EventBus {
  private _listenersStore: Map<string, Set<ListenerFunc>> = new Map();

  static create() {
    return new this();
  }

  constructor() {
    //
  }

  on(event: string, listener: ListenerFunc) {
    let listeners = this._listenersStore.get(event);

    if (listeners === undefined) {
      listeners = new Set();
      this._listenersStore.set(event, listeners);
    }

    listeners?.add(listener);

    return () => {
      listeners?.delete(listener);
    };
  }

  off(event: string, listener: ListenerFunc) {
    this._listenersStore.get(event)?.delete(listener);
  }

  emit(event: string, ...args: Args) {
    this._listenersStore.get(event)?.forEach((listener) => listener(...args));
  }

  removeAllListeners(...events: string[]) {
    if (!events.length) {
      this._listenersStore.clear();
      return;
    }

    events.forEach((event) => this._listenersStore.delete(event));
  }
}
