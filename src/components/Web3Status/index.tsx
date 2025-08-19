import Davatar from '@davatar/react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, CogIcon, GiftIcon, UserIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWeb3React } from '@web3-react/core'
import { NetworkContextName } from 'app/constants'
import Image from 'app/features/common/Image'
import { shortenAddress } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import useENSName from 'app/hooks/useENSName'
import WalletModal from 'app/modals/WalletModal'
import { useProfile } from 'app/services/apis/hooks'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import Link from 'next/link'
// import Image from 'next/image'
import React, { Fragment, useMemo } from 'react'
import Identicon from 'react-blockies'

import Loader from '../Loader'
import Typography from '../Typography'
import Web3Connect from '../Web3Connect'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const { account, library } = useWeb3React()

  const { ENSName, loading } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length

  const toggleWalletModal = useWalletModalToggle()

  const { data } = useProfile(account)

  function getAvatar() {
    if (data && data.avatar_url) {
      return (
        <div className="avatar">
          <div className="w-6 rounded-full">
            <Image width={24} height={24} layout="responsive" src={data.avatar_url} alt="account avatar" />
          </div>
        </div>
      )
    }
    return (
      <>
        <Davatar
          size={24}
          address={account ?? ''}
          defaultComponent={<Identicon seed={account ? account : ''} className="!w-6 !h-6 rounded-full" />}
          provider={library}
        />
      </>
    )
  }

  if (account) {
    return (
      <div id="web3-status-connected" className="flex items-center gap-2 text-sm rounded-lg text-primary">
        <div className="relative flex items-center gap-2 cursor-pointer pointer-events-auto">
          <div className="flex flex-col px-2">
            <Typography
              weight={700}
              variant="sm"
              className="font-bold rounded-full text-base-content hover:text-primary"
              onClick={toggleWalletModal}
            >
              {ENSName ? ENSName.toUpperCase() : shortenAddress(account)}
            </Typography>
            {hasPendingTransactions ? (
              <div className="flex items-center justify-between gap-2">
                <Typography variant="xxs">
                  {pending?.length} {i18n._(t`Pending`)}
                </Typography>{' '}
                <Loader stroke="white" />
              </div>
            ) : (
              <></>
            )}
          </div>
          {isDesktop ? (
            <>
              <Popover className="relative h-6">
                <Popover.Button>
                  <div className="flex flex-row items-end gap-2">
                    {getAvatar()}
                    <ChevronDownIcon className="w-4 h-4"></ChevronDownIcon>
                  </div>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 top-[44px] h-6">
                    <div className="flex flex-col border rounded-b shadow-sm bg-base-100">
                      <div
                        className="flex flex-row items-center justify-start w-56 gap-4 p-4 border-b cursor-pointer hover:bg-base-200"
                        onClick={toggleWalletModal}
                      >
                        <UserIcon width={24} height={24}></UserIcon>
                        <Typography weight={700} variant="base">
                          {i18n._(t`Account`)}
                        </Typography>
                      </div>
                      <Link href={'/affiliate'}>
                        <a className="w-full">
                          <div className="flex flex-row items-center justify-start w-56 gap-4 p-4 border-b cursor-pointer hover:bg-base-200">
                            <GiftIcon width={24} height={24}></GiftIcon>
                            <Typography weight={700} variant="base">
                              {i18n._(t`Affiliate`)}
                            </Typography>
                          </div>
                        </a>
                      </Link>
                      <Link href={'/account/settings'}>
                        <a className="w-full">
                          <div className="flex flex-row items-center justify-start w-56 gap-4 p-4 cursor-pointer hover:bg-base-200">
                            <CogIcon width={24} height={24}></CogIcon>
                            <Typography weight={700} variant="base">
                              {i18n._(t`Settings`)}
                            </Typography>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </>
          ) : (
            <>
              <div className="flex flex-row items-end" onClick={toggleWalletModal}>
                {getAvatar()}
              </div>
            </>
          )}
        </div>
        {/* {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} account={account} provider={library} />
        )} */}
      </div>
    )
  } else {
    return <Web3Connect color="primary" />
  }
}

export function WalletModalInner() {
  const { account } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)
  return (
    <>
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      {/* <WalletModalInner /> */}
    </>
  )
}
