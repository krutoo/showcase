import type { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './layout.m.css';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

export interface AsideProps extends HTMLAttributes<HTMLElement> {}

export interface MainProps extends HTMLAttributes<HTMLElement> {}

export function Root({ className, children, ...restProps }: LayoutProps): ReactNode {
  // currently preset "fixed nav" is always enabled
  // @todo ability to disable preset "fixed nav"
  const rootClassName = classNames(styles.root, styles.presetFixedNav, className);

  return (
    <div data-kind='PageLayout' className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}

export function Header({ className, children, ...restProps }: HeaderProps): ReactNode {
  const rootClassName = classNames(styles.header, className);

  return (
    <header data-kind='PageHeader' className={rootClassName} {...restProps}>
      {children}
    </header>
  );
}

export function Aside({ className, children, ...restProps }: HeaderProps): ReactNode {
  const rootClassName = classNames(styles.aside, className);

  return (
    <aside data-kind='PageAside' className={rootClassName} {...restProps}>
      {children}
    </aside>
  );
}

export function Main({ className, children, ...restProps }: MainProps): ReactNode {
  const rootClassName = classNames(styles.main, className);

  return (
    <main data-kind='PageMain' className={rootClassName} {...restProps}>
      {children}
    </main>
  );
}

/** Set of UI components to define page layout. */
export const Layout = {
  Root,
  Header,
  Main,
  Aside,
};
