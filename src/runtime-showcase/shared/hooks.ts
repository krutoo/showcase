import { useRef } from 'react';

export function useInitial<T>(value: T): T {
  const ref = useRef(value);
  return ref.current;
}
