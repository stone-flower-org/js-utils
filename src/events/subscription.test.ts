import { EventBus } from './event-bus';
import { createSubscriptionForEventBus } from './subscription';

const defaultEvent = 'event';

describe('createSubscriptionForEventBus', () => {
  describe('it should return subscribe function', () => {
    it('should add event listener to provided EventBus and listen provided event after call', () => {
      const listener = vi.fn();
      const eventBus = EventBus.create();
      const subsribe = createSubscriptionForEventBus(eventBus, defaultEvent);

      subsribe(listener);
      eventBus.emit(defaultEvent);

      expect(listener).toHaveBeenCalled();
    });

    it('should return unsubscribe function, it should remove listener from event bus after call', () => {
      const listener = vi.fn();
      const eventBus = EventBus.create();
      const subsribe = createSubscriptionForEventBus(eventBus, defaultEvent);

      const unsubscribe = subsribe(listener);
      unsubscribe();
      eventBus.emit(defaultEvent);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
