import styles from './primary.m.css';

export const meta = {
  title: 'Primary example',
  category: 'Components/Button',
};

export default function () {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      Some action
    </button>
  );
}
