import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Code from 'app/features/affiliate/Code'
// import { Feature } from 'app/enums/Feature'
// import NetworkGuard from 'app/guards/Network'
import SignGuard from 'app/guards/Sign'
import { useActiveWeb3React } from 'app/services/web3'
import { NextSeo } from 'next-seo'
import React from 'react'

const Affiliate = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  return (
    <>
      <NextSeo title={`${i18n._(t`Affiliate`)}`} />
      <div className="container px-6">
        <Code></Code>
      </div>
    </>
  )
}
Affiliate.Guard = SignGuard(false)
export default Affiliate
