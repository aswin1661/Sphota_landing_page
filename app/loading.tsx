
'use client';
import { useEffect, useState } from 'react';
import styles from './Loader.module.css';
export default function Loading() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 1000); // 1 second delay
    return () => clearTimeout(timeout);
  }, []);
  return show? (
    <div className={styles.wrapper}>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.shadow}></div>
      <div className={styles.shadow}></div>
      <div className={styles.shadow}></div>
    </div>
  ):null;
}
