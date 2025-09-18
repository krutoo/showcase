import { forwardRef } from 'react';
import type { IconProps } from './types';

export const CrossSVG = forwardRef<SVGSVGElement, IconProps>(function CrossSVG(props, ref) {
  return (
    <svg ref={ref} width='24' height='24' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M18.2929 4.29297C18.6834 3.90245 19.3164 3.90245 19.707 4.29297C20.0975 4.68349 20.0975 5.31651 19.707 5.70703L5.70696 19.707C5.31643 20.0976 4.68342 20.0976 4.29289 19.707C3.90237 19.3165 3.90237 18.6835 4.29289 18.293L18.2929 4.29297Z' />
      <path d='M19.707 18.293C20.0975 18.6835 20.0975 19.3165 19.707 19.707C19.3165 20.0976 18.6834 20.0976 18.2929 19.707L4.29292 5.70703C3.9024 5.31651 3.9024 4.68349 4.29292 4.29297C4.68345 3.90244 5.31646 3.90244 5.70698 4.29297L19.707 18.293Z' />
    </svg>
  );
});
