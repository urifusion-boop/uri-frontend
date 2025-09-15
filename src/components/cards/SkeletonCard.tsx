import React from 'react';
import styles from '@/styles/SkeletonCard.module.css'; // Assuming you have a CSS module

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.skeleton}>
        <div className={styles.mast}>
          <p className={styles.skeletonName}></p>
          <p className={styles.skeletonLocation}></p>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
