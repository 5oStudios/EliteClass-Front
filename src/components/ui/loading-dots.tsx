import React from 'react';
import styles from '@/src/styles/loader.module.css';

type Props = {
  color: string;
  size: number;
  width: number;
  height: number;
};

export const LoadingDots = ({ size, color, height, width }: Props) => (
  <>
    <div className={styles.ellipsis} style={{ width, height }}>
      <div style={{ background: color, width: size, height: size }} />
      <div style={{ background: color, width: size, height: size }} />
      <div style={{ background: color, width: size, height: size }} />
      <div style={{ background: color, width: size, height: size }} />
    </div>
  </>
);
