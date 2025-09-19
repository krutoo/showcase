import type { AnchorHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Link.m.css';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  color?: 'default' | 'unset' | 'black' | 'white';
};

export function Link({
  color = 'default',
  children,
  className,
  ...restProps
}: LinkProps): ReactNode {
  const rootClassName = classNames(
    styles.link,
    color === 'default' && styles['color-default'],
    color === 'black' && styles['color-black'],
    color === 'white' && styles['color-white'],
    className,
  );

  return (
    <a data-kind='Link' className={rootClassName} {...restProps}>
      {children}
    </a>
  );
}
