import { forwardRef } from 'react';
import type { IconProps } from './types';

export const BurgerMenuSVG = forwardRef<SVGSVGElement, IconProps>(
  function BurgerMenuSVG(props, ref) {
    return (
      <svg ref={ref} width='24' height='24' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <path d='M20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H20Z' />
        <path d='M20 6C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7C3 6.44772 3.44772 6 4 6H20Z' />
        <path d='M20 16C20.5523 16 21 16.4477 21 17C21 17.5523 20.5523 18 20 18L4 18C3.44772 18 3 17.5523 3 17C3 16.4477 3.44772 16 4 16L20 16Z' />
      </svg>
    );
  },
);
