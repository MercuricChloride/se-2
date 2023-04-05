import "~~/styles/globals.css";

import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { Toaster } from "react-hot-toast";

import "@rainbow-me/rainbowkit/styles.css";
import { appChains } from "~~/services/web3/wagmiConnectors";
import { wagmiClient } from "~~/services/web3/wagmiClient";
import { BlockieAvatar } from "~~/components/scaffold-eth";

import Header from "~~/components/Header";
import Footer from "~~/components/Footer";

import { useEffect, useMemo } from "react";
import { useAppStore } from "~~/services/store/store";
import { useEthPrice } from "~~/hooks/scaffold-eth";

import NextNProgress from "nextjs-progressbar";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useState } from "react";

const Scene = dynamic(() => import("../components/Scene"), { ssr: true });

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useEthPrice();
  const setEthPrice = useAppStore(state => state.setEthPrice);

  //get the page route
  const { route } = useRouter();
  const threeJsRoutes = useMemo(() => ["/three", "/scene"], []);
  const isThreeJs = threeJsRoutes.includes(route);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (price > 0) {
      setEthPrice(price);
    }
  }, [setEthPrice, price]);

  return (
    <WagmiConfig client={wagmiClient}>
      <NextNProgress />
      <RainbowKitProvider chains={appChains.chains} avatar={BlockieAvatar}>
        <div className="flex flex-col min-h-screen">
          {!isThreeJs && <Header />}
          <main className="relative flex flex-col flex-1">
            {isThreeJs ? (
              ok ? (
                <Scene className="pointer-events-none" eventPrefix="client">
                  <Component {...pageProps} />
                </Scene>
              ) : (
                //center a button and make them click it to enter
                <div className="flex flex-col items-center justify-center h-screen bg-black ">
                  <button
                    className="px-4 py-2 text-lg font-semibold text-white bg-black border border-white rounded-md hover:bg-white hover:text-black"
                    onClick={() => setOk(true)}
                  >
                    Enter
                  </button>
                </div>
              )
            ) : (
              <Component {...pageProps} />
            )}
          </main>
          {!isThreeJs && <Footer />}
        </div>
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default ScaffoldEthApp;
