import React from 'react';

import styles from '../../../styles/Header.module.scss';

export const Header = () => {
  return (
    <div className={styles.container}>
      <div>
        Tee Crew
      </div>
      <div>
        Search bar
      </div>
      <div>
        Log in
      </div>
    </div>
  );
};
