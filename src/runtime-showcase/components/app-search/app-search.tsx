import type { ReactNode } from 'react';
import { Input } from '../input';
import styles from './app-search.m.css';

export interface AppSearchProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function AppSearch({ value, onValueChange }: AppSearchProps): ReactNode {
  return (
    <div className={styles.root}>
      <Input
        className={styles.input}
        type='search'
        placeholder='Search...'
        value={value}
        onChange={event => onValueChange(event.target.value)}
      />
    </div>
  );
}
