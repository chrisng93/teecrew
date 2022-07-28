import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import { SWRConfig } from 'swr';

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
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SWRConfig
      value={{ fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()) }}
    >
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default MyApp;
