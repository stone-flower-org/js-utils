import { Args } from '@/src/core';
import { EventBus, ListenerFunc } from '@/src/events';

export type SubscribeListenerFunc<A extends Args> = (...args: A) => void;

export type UnsubscribeFunc = () => void;

export type SubscribeFunc<A extends Args> = (listener: SubscribeListenerFunc<A>) => UnsubscribeFunc;

export const createSubscriptionForEventBus =
  // biome-ignore lint/suspicious/noExplicitAny: use any args
    <A extends any[]>(eventBus: EventBus, event: string) =>
    (listener: SubscribeListenerFunc<A>) =>
      eventBus.on(event, listener as ListenerFunc);
