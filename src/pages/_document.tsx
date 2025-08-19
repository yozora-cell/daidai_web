/* eslint-disable @next/next/no-document-import-in-page */
// pages/_document.js
import { Head, Html, Main, NextScript } from 'next/document'

const APP_NAME = 'DAIDAI'
const APP_TITLE = 'DAIDAI: NFT Marketplace'
const APP_DESCRIPTION = 'NFT Marketplace - Discover INOs and Collect Rare NFTs'
const APP_KEYWORDS = 'DAIDAI, NFT, erc721, marketplace, tokens, tokenization, digital goods, trade, crypto, blockchain'
const APP_AUTHORS = 'DAIDAI DAO'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0993ec" />
        <meta
          name="viewport"
          content="minimum-scale=1.0, initial-scale=1.0, maximum-scale=1.0, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />

        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="author" content={APP_AUTHORS} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="keywords" content={APP_KEYWORDS} />

        <meta property="og:title" content={APP_TITLE} />
        <meta property="og:url" content="https://daidai.io/" />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:image" content="/icons/icon-144x144.png" />
        <meta property="og:locale" content="ja" />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={APP_TITLE} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:image" content="/icons/icon-144x144.png" />
        <meta name="twitter:site" content="@DaiDaiNFTMarket" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
