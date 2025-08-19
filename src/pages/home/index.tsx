// import { t } from '@lingui/macro'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { fetchAPI } from '../../lib/api'
// import Button from 'app/components/Button'
// import Typography from 'app/components/Typography'
import { Feature } from 'app/enums/Feature'
import Charter from 'app/features/home/Charter'
import ExploreNew from 'app/features/home/ExploreNew'
// import Slider from 'app/features/home/Slider'
import Hero from 'app/features/home/Hero'
import HotCollection, { HotCollectionFeature } from 'app/features/home/HotCollection'
import HotIno from 'app/features/home/HotIno'
// import Medium from 'app/features/home/Medium'
import Service from 'app/features/home/Service'
// import TopSeller from 'app/features/home/TopSeller'
import NetworkGuard from 'app/guards/Network'
import { useExplorer } from 'app/services/apis/hooks'
// import { useActiveWeb3React } from 'app/services/web3'
// import { useWalletModalToggle } from 'app/state/application/hooks'
import { NextSeo } from 'next-seo'
import React from 'react'

const Home = () => {
  const { i18n } = useLingui()
  const { data, error, isValidating } = useExplorer()
  // console.log('hot ino data', data)
  return (
    <>
      <NextSeo title={`${i18n._(t`Home`)}`} />
      <Hero data={data?.recommendCollection} loading={isValidating} />
      {/* <Medium /> */}
      <HotIno list={data?.inoCollection} loading={!data} />
      <HotCollection list={data?.hotCollection} loading={!data} feature={HotCollectionFeature.HOME} />
      {/* <TopSeller /> */}
      <ExploreNew />
      <Charter></Charter>
      <Service></Service>
    </>
  )
}
Home.Guard = NetworkGuard(Feature.HOME)
export default Home
