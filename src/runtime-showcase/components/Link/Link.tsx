import { AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Link.m.css';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  color?: 'unset' | 'black' | 'white';
};

export function Link({ color = 'black', children, className, ...restProps }: LinkProps) {
  const rootClassName = classNames(
    color === 'black' && styles['color-black'],
    color === 'white' && styles['color-white'],
    className,
  );

  return (
    <a {...restProps} className={rootClassName}>
      {children}
    </a>
  );
}
