import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@mui/material/Button';

import styles from '../../styles/Header.module.scss';

const Auth = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button color="secondary" onClick={() => signOut()}>Sign out</Button>
    );
  }
  return <Button color="secondary" onClick={() => signIn('google')}>Sign in</Button>;
};

export const Header = () => (
  <div className={styles.container}>
    <div>
      {/** TODO: Add actual logo or something */}
      Tee Crew
    </div>
    <div>
      {/** TODO: Add search for golfers */}
      Search bar
    </div>
    <Auth />
  </div>
);
