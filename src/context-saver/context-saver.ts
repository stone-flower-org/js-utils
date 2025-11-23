export interface ContextSaver {
  // biome-ignore lint/suspicious/noExplicitAny: use any args and return params
  useFunc<F extends (...args: any[]) => any>(callback: F): F;
}

// TODO: write unit tests
export const createContextSaver = (that: object): ContextSaver => {
  const map = new Map<string, () => void>();
  return {
    // biome-ignore lint/suspicious/noExplicitAny: use any args and return params
    useFunc<F extends (...args: any[]) => any>(callback: F): F {
      let f = map.get(callback.name);
      if (f) return f as F;

      f = callback.bind(that);
      map.set(callback.name, f);

      return f as F;
    },
  };
};
