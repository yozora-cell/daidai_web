// import { ArrowDownIcon } from '@heroicons/react/solid'
// import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { fetchAPI } from '../../lib/api'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums/Feature'
import Slider from 'app/features/home/Slider'
import NetworkGuard from 'app/guards/Network'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { NextSeo } from 'next-seo'
import React from 'react'

const Home = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <>
      <NextSeo title="Home" />
      <div className="container mx-auto">
        {account ? (
          <>
            <Typography variant="xs" className="py-2 text-center">
              {account}
            </Typography>
            <Slider></Slider>
          </>
        ) : (
          <>
            <Typography variant="base" className="py-2 text-center">
              Please click connect wallet to continue
            </Typography>

            <Button fullWidth color="primary" onClick={toggleWalletModal} className="rounded-2xl md:rounded">
              connect wallet
            </Button>
          </>
        )}
      </div>
    </>
  )
}
Home.Guard = NetworkGuard(Feature.HOME)
export default Home
