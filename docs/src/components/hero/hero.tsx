import { useContext } from 'react';
import { ColorSchemesContext } from '@krutoo/showcase/runtime-showcase';
import classNames from 'classnames';
import styles from './hero.m.css';

export function Hero() {
  const { colorScheme } = useContext(ColorSchemesContext);

  return (
    <div className={classNames(styles.root, colorScheme === 'dark' && styles.dark)}>
      <img
        className={styles.logo}
        alt='Logo'
        src={colorScheme === 'dark' ? 'public/logo.dark.svg' : 'public/logo.svg'}
      />
      <div className={styles.header}>
        <h1 className={styles.title}>@krutoo/showcase</h1>
        <p className={styles.subtitle}>
          Simple library for creating websites with examples of how your code works
        </p>
      </div>

      <div className={styles.buttons}>
        <a className={classNames(styles.button, styles.filled)} href='/usage'>
          Docs
        </a>
        <a
          className={classNames(styles.button, styles.outlined)}
          href='https://github.com/krutoo/showcase'
          target='_blank'
        >
          GitHub
        </a>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>Build tool agnostic alternative of Storybook</div>
        <div className={styles.card}>MDX supported if your bundler configured</div>
        <div className={styles.card}>Currently only React is supported</div>
      </div>
    </div>
  );
}
