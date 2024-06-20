import { type HTMLAttributes } from 'react';
import styles from './Plate.m.css';
import classNames from 'classnames';

export type PlateProps = HTMLAttributes<HTMLDivElement>;

export function Plate({ children, className, ...restProps }: PlateProps) {
  return (
    <div {...restProps} className={classNames(styles.plate, className)}>
      {children}
    </div>
  );
}

export type PlateBodyProps = HTMLAttributes<HTMLDivElement>;

export function PlateBody({ children, className, ...restProps }: PlateBodyProps) {
  return (
    <div {...restProps} className={classNames(styles.body, className)}>
      {children}
    </div>
  );
}

export type PlateHeaderProps = HTMLAttributes<HTMLDivElement>;

export function PlateHeader({ children, className, ...restProps }: PlateHeaderProps) {
  return (
    <div {...restProps} className={classNames(styles.header, className)}>
      {children}
    </div>
  );
}
