export interface NanoStore<T> {
  getState(): T;
  setState(nextState: T | ((currentState: T) => T)): void;
  subscribe(listener: VoidFunction): VoidFunction;
}

export function createNanoStore<T>(initialState: T): NanoStore<T> {
  const listeners = new Set<VoidFunction>();

  let state = initialState;

  return {
    setState(nextState) {
      const prevState = state;

      if (typeof nextState === 'function') {
        state = (nextState as (currentState: T) => T)(state);
      } else {
        state = nextState;
      }

      if (prevState !== state) {
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
