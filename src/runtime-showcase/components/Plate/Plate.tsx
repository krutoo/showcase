import type { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Plate.m.css';

export type PlateProps = HTMLAttributes<HTMLDivElement>;

export function Plate({ children, className, ...restProps }: PlateProps): ReactNode {
  return (
    <div data-kind='Plate' {...restProps} className={classNames(styles.plate, className)}>
      {children}
    </div>
  );
}

export type PlateBodyProps = HTMLAttributes<HTMLDivElement>;

export function PlateBody({ children, className, ...restProps }: PlateBodyProps): ReactNode {
  return (
    <div {...restProps} className={classNames(styles.body, className)}>
      {children}
    </div>
  );
}

export type PlateHeaderProps = HTMLAttributes<HTMLDivElement>;

export function PlateHeader({ children, className, ...restProps }: PlateHeaderProps): ReactNode {
  return (
    <div {...restProps} className={classNames(styles.header, className)}>
      {children}
    </div>
  );
}
