import styles from './primary.module.css';

export const meta = {
  title: 'Primary example',
  category: 'Components/Input',
};

export default function Story() {
  return <input className={styles.input} placeholder='Type something' />;
}
