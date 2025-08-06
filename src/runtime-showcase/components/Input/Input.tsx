import type { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Input.m.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...restProps }: InputProps) {
  return <input className={classNames(styles.input, className)} {...restProps} />;
}
