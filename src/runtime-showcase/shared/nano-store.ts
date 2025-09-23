export interface NanoStore<T> {
  getState(): T;
  setState(nextState: T): void;
  subscribe(listener: VoidFunction): VoidFunction;
}

export function createNanoStore<T>(initialState: T): NanoStore<T> {
  const listeners = new Set<VoidFunction>();

  let state = initialState;

  return {
    setState(nextState) {
      if (state !== nextState) {
        state = nextState;

        for (const func of listeners) {
          func();
        }
      }
    },
    getState() {
      return state;
    },
    subscribe(callback) {
      listeners.add(callback);

      return () => {
        listeners.delete(callback);
      };
    },
  };
}
