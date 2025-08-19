// import { KashiLendingList } from 'app/features/kashi/KashiLendingList'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
// import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import TridentLayout, { TridentHeader } from 'app/layouts/Trident'
import { NextSeo } from 'next-seo'
import React from 'react'

const Lending = () => {
  const account = useAccountInUrl('/')

  if (!account) return <></>

  return (
    <>
      <NextSeo title={`Kashi lending positions for account ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader>
      {/* <TridentBody className="flex flex-col lg:flex-row">
        <KashiLendingList />
      </TridentBody> */}
      <ActionsModal />
    </>
  )
}

Lending.Layout = TridentLayout

export default Lending
