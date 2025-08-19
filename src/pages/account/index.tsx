import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import PleaseSignIn from 'app/components/PleaseSignIn'
import { useActiveWeb3React } from 'app/services/web3'
import { NextSeo } from 'next-seo'
import React from 'react'

import { Account } from './[account]/index'

const Page = () => {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  return (
    <>
      {account ? (
        <>
          <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
          <Account account={account}></Account>
        </>
      ) : (
        <>
          <NextSeo title={`${i18n._(t`Account`)}`} />
          <div className="container">
            <PleaseSignIn></PleaseSignIn>
          </div>
        </>
      )}
    </>
  )
}

export default Page
