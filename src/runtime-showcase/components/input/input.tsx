import type { InputHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './input.m.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...restProps }: InputProps): ReactNode {
  return <input className={classNames(styles.input, className)} {...restProps} />;
}
