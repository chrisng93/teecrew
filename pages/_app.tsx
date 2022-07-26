import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';

import Header from '../modules/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008763',
    },
    secondary: {
      main: '#F9F8EC',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
