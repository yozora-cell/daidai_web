import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'app/enums/Feature'
import Explore, { ExploreFeature, getChangedQuery } from 'app/features/home/Explore'
import { OrderFields } from 'app/features/home/ExploreFilters'
import HotCollection, { HotCollectionFeature } from 'app/features/home/HotCollection'
import NetworkGuard from 'app/guards/Network'
import { useExplorer } from 'app/services/apis/hooks'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

const Home = () => {
  const { i18n } = useLingui()
  const { data, error, isValidating } = useExplorer()
  const router = useRouter()
  const { pathname, query } = router
  const changeQuery = (name: string, value: any, hash?: string) => {
    router.push(getChangedQuery(name, value, pathname, query, hash), undefined, { shallow: true })
  }
  return (
    <>
      <NextSeo title={`${i18n._(t`Explore`)}`} />
      <HotCollection list={data?.hotCollection} loading={isValidating} feature={HotCollectionFeature.EXPLORE} />
      <Explore
        feature={ExploreFeature.EXPLORE}
        onChangeFilter={function (isOnSale: boolean): void {
          changeQuery('onsale', isOnSale ? '1' : '')
        }}
        onChangeSort={function (field: OrderFields, direction: 'desc' | 'asc'): void {
          changeQuery('sort', `${field}-${direction}`)
        }}
        onChangeCollection={function (collection: string): void {
          changeQuery('collection', collection)
        }}
        onChangeCategory={function (category: string): void {
          changeQuery('category', category)
        }}
        onChangePage={function (page: number): void {
          changeQuery('page', String(page), '#explore')
        }}
      />
    </>
  )
}
Home.Guard = NetworkGuard(Feature.HOME)
export default Home
