export interface MicroStore<T> {
  getState(): T;
  setState(nextState: T | ((currentState: T) => T)): void;
  subscribe(listener: VoidFunction): VoidFunction;
}

export function createMicroStore<T>(initialState: T): MicroStore<T> {
  const listeners = new Set<VoidFunction>();

  let state = initialState;

  return {
    setState(nextState) {
      const prevState = state;

      state =
        typeof nextState === 'function' ? (nextState as (currentState: T) => T)(state) : nextState;

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
