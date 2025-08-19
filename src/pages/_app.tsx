import '../bootstrap'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/index.css'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
// import { remoteLoader } from '@lingui/remote-loader'
import { Web3ReactProvider } from '@web3-react/core'
import Dots from 'app/components/Dots'
import Portals from 'app/components/Portals'
import Web3ReactManager from 'app/components/Web3ReactManager'
import getLibrary from 'app/functions/getLibrary'
import { exception, GOOGLE_ANALYTICS_TRACKING_ID, pageview } from 'app/functions/gtag'
// import { MultichainExploitAlertModal } from 'app/features/user/MultichainExploitAlertModal'
import { SignModal } from 'app/guards/Sign/SignModal'
import { setIsSigning } from 'app/hooks/useSignAndVerify'
import DefaultLayout from 'app/layouts/Default'
// import HttpUpdater from 'app/services/apis/updater'
// @ts-ignore TYPE NEEDS FIXING
import store, { persistor } from 'app/state'
import ApplicationUpdater from 'app/state/application/updater'
// import ListsUpdater from 'app/state/lists/updater'
import MulticallUpdater from 'app/state/multicall/updater'
import TransactionUpdater from 'app/state/transactions/updater'
import UserUpdater from 'app/state/user/updater'
import WalletUpdater from 'app/state/wallet/updater'
import { AuthUpdater, SignatureUpdater } from 'hooks/useSignAndVerify'
import * as plurals from 'make-plural/plurals'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
// import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import React, { Fragment, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SWRConfig } from 'swr'

import SEO from '../config/seo'

const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), { ssr: false })

// const PersistGate = dynamic(() => import('redux-persist/integration/react'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

// @ts-ignore TYPE NEEDS FIXING
function MyApp({ Component, pageProps, fallback, err }) {
  const router = useRouter()
  const { locale, events } = router
  console.log('locale, events', locale, events)

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    const handleRouteChange = (url) => {
      pageview(url)
      setIsSigning(false)
    }
    events.on('routeChangeComplete', handleRouteChange)

    // @ts-ignore TYPE NEEDS FIXING
    const handleError = (error) => {
      exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      })
    }

    window.addEventListener('error', handleError)

    return () => {
      events.off('routeChangeComplete', handleRouteChange)
      window.removeEventListener('error', handleError)
    }
  }, [events])

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    async function load(locale) {
      // @ts-ignore TYPE NEEDS FIXING
      i18n.loadLocaleData(locale, { plurals: plurals[locale.split('_')[0]] })

      // try {
      //   // Load messages from AWS, use q session param to get latest version from cache
      //   const res = await fetch(
      //     `https://raw.githubusercontent.com/sushiswap/translations/master/sushiswap/${locale}.json`
      //   )
      //   const remoteMessages = await res.json()

      //   const messages = remoteLoader({ messages: remoteMessages, format: 'minimal' })
      //   i18n.load(locale, messages)
      // } catch {
      //   // Load fallback messages
      //   const { messages } = await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`)
      //   i18n.load(locale, messages)
      // }

      const { messages } = await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`)
      i18n.load(locale, messages)

      i18n.activate(locale)
    }

    load(locale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment

  return (
    <>
      <Head>DAIDAI</Head>

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ReduxProvider store={store}>
                <PersistGate loading={<Dots>loading</Dots>} persistor={persistor}>
                  <>
                    {/* <ListsUpdater /> */}
                    <UserUpdater />
                    <ApplicationUpdater />
                    <MulticallUpdater />
                    <TransactionUpdater />
                    <WalletUpdater />
                    {/* <HttpUpdater /> */}
                    <AuthUpdater />
                    <SignatureUpdater />
                  </>
                  <Provider>
                    <Layout>
                      <Guard>
                        {/* TODO: Added alert Jan 25. Delete component after a few months. */}
                        {/* <MultichainExploitAlertModal /> */}
                        <SignModal />
                        {/*@ts-ignore TYPE NEEDS FIXING*/}
                        <DefaultSeo {...SEO} />
                        <SWRConfig
                          value={{
                            shouldRetryOnError: false,
                          }}
                        >
                          <Component {...pageProps} err={err} />
                        </SWRConfig>
                      </Guard>
                      <Portals />
                    </Layout>
                  </Provider>
                </PersistGate>
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </I18nProvider>
    </>
  )
}

export default MyApp
