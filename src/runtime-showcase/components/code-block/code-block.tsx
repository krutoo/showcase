import { type HTMLAttributes, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './code-block.m.css';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  lang?: string;
}

export function CodeBlock({ lang, children, className, ...restProps }: CodeBlockProps): ReactNode {
  return (
    <div className={classNames(styles.root, className)} {...restProps} data-lang={lang}>
      <pre className={styles.pre}>{children}</pre>
    </div>
  );
}
