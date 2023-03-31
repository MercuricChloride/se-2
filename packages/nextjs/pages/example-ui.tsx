import type { NextPage } from "next";
import Head from "next/head";
import { ContractInteraction } from "~~/components/ExampleUi";
import { SubgraphTable } from "./subgraph";

const ExampleUI: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="grid lg:grid-cols-3 flex-grow" data-theme="exampleUi">
        <ContractInteraction />
        <SubgraphTable uri="https://api.thegraph.com/subgraphs/name/blocklytics/bancor" />
        {/* <SubgraphTable uri="https://api.thegraph.com/subgraphs/name/decentraland/marketplace" /> */}
      </div>
    </>
  );
};

export default ExampleUI;
