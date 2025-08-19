import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/portfolio/AssetBalances/bentoAndWallet'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { NextSeo } from 'next-seo'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const account = useAccountInUrl('/')

  if (!account) return

  return (
    <>
      <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader>
      <TridentBody className="flex flex-col grid-cols-2 gap-10 lg:grid lg:gap-4">
        <WalletBalances account={account} />
        <BentoBalances account={account} />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio
