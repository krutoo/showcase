import styles from './primary.m.css';

export const meta = {
  title: 'Primary example',
  category: 'Components/Input',
};

export default function () {
  return <input className={styles.input} placeholder='Type something' />;
}
