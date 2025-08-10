import styles from './Loader.module.css';

export default function Loading({ hidden }: { hidden?: boolean }) {
  return (
   <div className={`${styles.wrapper} loader ${hidden ? "hidden" : ""}`}>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.shadow}></div>
      <div className={styles.shadow}></div>
      <div className={styles.shadow}></div>
    </div>
  );
}