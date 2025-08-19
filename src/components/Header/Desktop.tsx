// import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
// import Button from 'app/components/Button'
import Container from 'app/components/Container'
import { NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import { LogoIcon } from 'app/components/Icon'
import LanguageSwitch from 'app/components/LanguageSwitch'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import React, { FC } from 'react'

import Dots from '../Dots'
import Typography from '../Typography'
import { NavigationItem } from './NavigationItem'
import SearchInput from './SearchInput'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const isCoinbaseWallet = useIsCoinbaseWallet()
  const { i18n } = useLingui()

  return (
    <>
      <header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>
        <nav className={NAV_CLASS}>
          <Container maxWidth="full" className="mx-auto">
            <div className="flex items-center justify-between gap-4 px-6">
              <div className="flex flex-row items-center w-full gap-4">
                <div className="flex items-center mr-4">
                  <Link href="/home" passHref={true}>
                    <a>
                      <LogoIcon width={126} className="text-primary" />
                    </a>
                  </Link>
                </div>
                <SearchInput autoFocus={false} />
                {menu.map((node) => {
                  if (node.key == 'create') {
                    return <></>
                  } else {
                    return <NavigationItem node={node} key={node.key} />
                  }
                })}
              </div>

              <div className="flex items-center justify-end w-auto select-none whitespace-nowrap">
                {/* {account ? (
                  <Link href="/create">
                    <a>
                      <Button color="primary" className="h-10 mr-4 rounded-3xl min-h-[40px]">
                        {i18n._(t`Create`)}
                      </Button>
                    </a>
                  </Link>
                ) : (
                  <></>
                )} */}
                <LanguageSwitch isGhost={true}></LanguageSwitch>

                {account && chainId && (
                  <Typography weight={700} variant="sm" className="px-2 py-5 font-bold">
                    {userEthBalance ? (
                      `${userEthBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`
                    ) : (
                      <Dots>FETCHING</Dots>
                    )}
                  </Typography>
                )}

                {library && (library.provider.isMetaMask || isCoinbaseWallet) && (
                  <div className="hidden sm:inline-block">
                    <Web3Network />
                  </div>
                )}

                <Web3Status />
              </div>
            </div>
          </Container>
        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Desktop
