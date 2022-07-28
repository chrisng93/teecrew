import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import SportsGolfSharpIcon from '@mui/icons-material/SportsGolfSharp';
import { Button } from '@mui/material';

import styles from '../../styles/Header.module.scss';

const SignInOut = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (isAuthenticated) {
    return (
      <Button color="secondary" onClick={() => signOut()}>Sign out</Button>
    );
  }
  return <Button color="secondary" onClick={() => signIn('google')}>Sign in</Button>;
};

export const Header = () => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.logo}>
          <SportsGolfSharpIcon />
          <span>Tee Crew</span>
        </div>
        <div className={styles.searchBar}>
          {/** TODO: Search for other golfers by userid */}
          <SearchSharpIcon />
        </div>
      </div>
      <div className={styles.subContainer}>
        <div>
          {isAuthenticated && (
            <Link href="/profile/edit">
              Profile
            </Link>
          )}
        </div>
        <SignInOut isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};
