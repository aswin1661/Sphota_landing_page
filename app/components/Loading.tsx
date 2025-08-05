import styles from '../Loader.module.css';

export default function Loading() {
  return (
    <div className={styles['🤚']}>
      <div className={styles['👉']}></div>
      <div className={styles['👉']}></div>
      <div className={styles['👉']}></div>
      <div className={styles['👉']}></div>
      <div className={styles['🌴']}></div>
      <div className={styles['👍']}></div>
    </div>
  );
}