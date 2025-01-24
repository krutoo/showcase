import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Layout.m.css';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

export interface AsideProps extends HTMLAttributes<HTMLElement> {}

export interface MainProps extends HTMLAttributes<HTMLElement> {}

export function Layout({ className, children, ...restProps }: LayoutProps) {
  const rootClassName = classNames(styles.layout, className);

  return (
    <div data-kind='PageLayout' className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}

export function Header({ className, children, ...restProps }: HeaderProps) {
  const rootClassName = classNames(styles.header, className);

  return (
    <header data-kind='PageHeader' className={rootClassName} {...restProps}>
      {children}
    </header>
  );
}

export function Aside({ className, children, ...restProps }: HeaderProps) {
  const rootClassName = classNames(styles.aside, className);

  return (
    <aside data-kind='PageAside' className={rootClassName} {...restProps}>
      {children}
    </aside>
  );
}

export function Main({ className, children, ...restProps }: MainProps) {
  const rootClassName = classNames(styles.main, className);

  return (
    <main data-kind='PageMain' className={rootClassName} {...restProps}>
      {children}
    </main>
  );
}
