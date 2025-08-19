import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'app/enums/Feature'
import Event from 'app/features/mobile/Event'
import Explore from 'app/features/mobile/Explore'
import HotNewProducts from 'app/features/mobile/HotNewProducts'
import NewArrival from 'app/features/mobile/NewArrival'
import Ranking from 'app/features/mobile/Ranking'
import Recommend from 'app/features/mobile/Recommend'
import NetworkGuard from 'app/guards/Network'
import { useExplorer } from 'app/services/apis/hooks'
import { NextSeo } from 'next-seo'
import React from 'react'

const Mobile = () => {
  const { i18n } = useLingui()
  const { data, error, isValidating } = useExplorer()
  // console.log('hot ino data', data)
  return (
    <>
      <NextSeo title={`${i18n._(t`Home`)}`} />
      <div className="w-full px-4 h-28">
        <Event />
      </div>
      <div className="w-full px-4">
        <Ranking />
      </div>
      <div className="w-full px-4">
        <Recommend list={data?.hotCollection} />
      </div>
      <div className="w-full px-4">
        <NewArrival list={data?.hotCollection} />
      </div>
      <div className="w-full px-4">
        <HotNewProducts list={data?.hotCollection} />
      </div>
      <div className="w-full px-4">
        <Explore />
      </div>
    </>
  )
}
Mobile.Guard = NetworkGuard(Feature.HOME)
export default Mobile
