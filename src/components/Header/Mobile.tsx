import { Dialog, Transition } from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon, SearchIcon } from '@heroicons/react/solid'
import { NATIVE } from '@sushiswap/core-sdk'
import { NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import { LogoIcon } from 'app/components/Icon'
import LanguageSwitch from 'app/components/LanguageSwitch'
import Web3Connect from 'app/components/Web3Connect'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { classNames } from 'app/functions'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useEffect, useState } from 'react'

import { NavigationItem } from './NavigationItem'
import SearchInput from './SearchInput'

const Mobile: FC = () => {
  const menu = useMenu()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)
  const isCoinbaseWallet = useIsCoinbaseWallet()
  const router = useRouter()
  const { locale, events } = router

  const HEADER_HEIGHT = 64

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    const handleRouteChange = (url) => {
      setOpen(false)
    }
    events.on('routeChangeComplete', handleRouteChange)

    return () => {
      events.off('routeChangeComplete', handleRouteChange)
    }
  }, [events])

  const [isShowSearch, setIsShowSearch] = useState(false)

  return (
    <>
      <header
        className={classNames('w-full flex items-center justify-between min-h-[64px] h-[64px] fixed z-20', NAV_CLASS)}
      >
        {isShowSearch ? (
          <>
            <div className="flex flex-row items-center w-full gap-4 px-4">
              <ChevronLeftIcon
                className="w-6 h-6 cursor-pointer text-primary"
                onClick={() => {
                  setIsShowSearch(false)
                }}
              />
              <SearchInput autoFocus={true} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between flex-grow w-full gap-4 px-4">
              <div className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-full hover:text-base-content/30">
                  <MenuIcon
                    width={28}
                    className="cursor-pointer text-base-content hover:text-base-300"
                    onClick={() => setOpen(true)}
                  />
                </div>
                <Link href="/home" passHref={true}>
                  <a className="w-full">
                    <LogoIcon width={100} className="text-primary" />
                  </a>
                </Link>
              </div>
              <div className="flex flex-row justify-end flex-grow">
                <SearchIcon
                  className="w-6 h-6 cursor-pointer text-primary"
                  onClick={() => {
                    setIsShowSearch(true)
                  }}
                />
              </div>
              {account ? (
                <>
                  <Web3Network />
                </>
              ) : (
                <>
                  <Web3Connect />
                </>
              )}
            </div>
          </>
        )}
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-20 overflow-hidden" onClose={setOpen}>
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 transition-opacity bg-base-content bg-opacity-80" />
              </Transition.Child>

              <div className="fixed inset-y-0 left-0 pr-10 max-w-[260px] flex">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-[-100%]"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-[-100%]"
                >
                  <div className="w-screen max-w-sm">
                    <div className="flex flex-col h-full py-6 overflow-x-hidden overflow-y-scroll shadow-xl bg-base-100">
                      <nav className="flex-1 pl-6" aria-label="Sidebar">
                        {menu.map((node) => {
                          return <NavigationItem node={node} key={node.key} />
                        })}
                        <LanguageSwitch isGhost={true} isLeftNav={true}></LanguageSwitch>
                      </nav>

                      <div className="flex flex-col gap-4 px-6">
                        {library && (library.provider.isMetaMask || isCoinbaseWallet) && (
                          <div className="hidden sm:flex">
                            <Web3Network />
                          </div>
                        )}

                        <div className="flex items-center justify-start gap-2">
                          <div className="">
                            {account && chainId && userEthBalance && (
                              <Link href={`/account/${account}`} passHref={true}>
                                <a className="hidden px-3 text-base-content text-bold md:block">
                                  {/*@ts-ignore*/}
                                  {userEthBalance?.toSignificant(4)} {NATIVE[chainId || 1].symbol}
                                </a>
                              </Link>
                            )}
                            <Web3Status />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Mobile
