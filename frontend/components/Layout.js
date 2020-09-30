import React, { useState } from "react";

import { ReactQueryDevtools } from "react-query-devtools";
import { ModalContainer } from "reoverlay";

import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ siteTitle, children, ...props }) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />

        <title>CloudLearning.dev</title>
      </Head>
      <section className="flex flex-col min-h-screen justify-between">
        <Header />
        <div className="flex-grow mt-8 lg:px-16 px-6">{children}</div>

        <Footer />
        <ModalContainer />
        <ReactQueryDevtools />
      </section>
    </div>
  );
}
