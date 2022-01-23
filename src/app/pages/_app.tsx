import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppLayout from "../components/AppLayout/AppLayout";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </SessionProvider>
  );
}

export default App;
