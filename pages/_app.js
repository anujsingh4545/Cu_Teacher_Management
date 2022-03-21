import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider>
      {/*  */}

      <RecoilRoot>
        <Head>
          <title>Teacher Managment System </title>
          <meta name="description" content="A teacher management system created for chandigarh university faculty ...!" />
          <link rel="icon" href="/icons.png" />
        </Head>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity"></script>
        <script src="https://smtpjs.com/v3/smtp.js"></script>

        <Component {...pageProps} />
      </RecoilRoot>

      {/*  */}
    </SessionProvider>
  );
}

export default MyApp;
