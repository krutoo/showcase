import { type EffectCallback, useEffect } from 'react';
import { zeroDeps } from '@krutoo/utils/react';

export function useMountEffect(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, zeroDeps);
}
