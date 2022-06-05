import React from "react";
import Header from "./Header";
import Head from "next/head";
import { Container } from "semantic-ui-react";

const Layout = (props) => {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <h2 style={{color: 'red', marginTop: '10px'}}>WARNING: This is a test dApp running on Ethereum Rinkeby test network. Metamask is required. Please use a development wallet without real money in it or in Ethereum mainnet.</h2>
      <Header />
      {props.children}
    </Container>
  );
};
export default Layout;
