import { ChainId } from '@sushiswap/core-sdk'
import Footer from 'app/components/Footer'
import Header from 'app/components/Header'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'
import TestNetworkWarning from 'app/components/TestNetworkWarning'
import TestNetworkWarningTest from 'app/components/TestNetworkWarning/test'
import { WalletModalInner } from 'app/components/Web3Status'
import { defaultChainId } from 'app/config/default_chainid'
import { useActiveWeb3React } from 'app/services/web3'
import { useChainId } from 'app/state/application/hooks'
// import { useIsDarkMode, useTheme } from 'app/state/theme/hooks'
import { useTheme } from 'app/state/theme/hooks'
import { useEffect } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const Layout = ({ children }) => {
  const theme = useTheme()
  const chainId = useChainId()
  const { account } = useActiveWeb3React()
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
  }, [theme])
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <Main>{children}</Main>
      <Popups />
      <Footer />
      {account && defaultChainId == ChainId.BSC && chainId == ChainId.BSC_TESTNET ? (
        <>
          <TestNetworkWarning></TestNetworkWarning>
        </>
      ) : (
        <></>
      )}
      {account && defaultChainId == ChainId.BSC_TESTNET && chainId == ChainId.BSC ? (
        <>
          <TestNetworkWarningTest></TestNetworkWarningTest>
        </>
      ) : (
        <></>
      )}
      <WalletModalInner />
    </div>
  )
}

export default Layout
