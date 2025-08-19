import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Reward from 'app/features/affiliate/Reward'
import SignGuard from 'app/guards/Sign'
import { useActiveWeb3React } from 'app/services/web3'
import { NextSeo } from 'next-seo'
import React from 'react'

const Affiliate = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  return (
    <>
      <NextSeo title={`${i18n._(t`Affiliate Reward`)}`} />
      <div className="container px-6">
        <Reward></Reward>
      </div>
    </>
  )
}
Affiliate.Guard = SignGuard(false)
export default Affiliate
