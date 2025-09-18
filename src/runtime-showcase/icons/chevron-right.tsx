import { forwardRef } from 'react';
import type { IconProps } from './types';

export const ChevronRightSVG = forwardRef<SVGSVGElement, IconProps>(
  function ChevronRight(props, ref) {
    return (
      <svg ref={ref} width='24' height='24' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <path d='M6.93946 2.93945C7.52525 2.35366 8.47477 2.35366 9.06056 2.93945L17.0606 10.9394C17.3419 11.2208 17.5 11.6022 17.5 12C17.5 12.3978 17.3419 12.7792 17.0606 13.0605L9.06056 21.0605C8.47477 21.6463 7.52525 21.6463 6.93946 21.0605C6.35368 20.4748 6.35368 19.5252 6.93946 18.9394L13.8789 12L6.93946 5.06054C6.35368 4.47475 6.35368 3.52523 6.93946 2.93945Z' />
      </svg>
    );
  },
);
