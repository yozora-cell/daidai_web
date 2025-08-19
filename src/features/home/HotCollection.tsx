import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Item, { ItemSkeleton } from 'app/features/collection/Item'
import { classNames } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery, useTouchDeviceMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { Collection } from 'app/types/daidai'
// import Button from 'app/components/Button'
// import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

export enum HotCollectionFeature {
  HOME = 'home',
  EXPLORE = 'explore',
  SEARCH = 'search',
}

const HotCollection = ({
  list,
  loading,
  feature = HotCollectionFeature.HOME,
}: {
  list?: Collection[]
  loading: boolean
  feature: HotCollectionFeature
}) => {
  const { i18n } = useLingui()
  const isTouch = useTouchDeviceMediaQuery()
  const defaultSlidesPerViewXL2 = 5
  const defaultSlidesPerViewXL = feature === HotCollectionFeature.SEARCH ? 4 : 5
  const defaultSpaceBetween = 20
  const [slidesPerView, setSlidesPerView] = useState(defaultSlidesPerViewXL)
  const [spaceBetween, setSpaceBetween] = useState(defaultSpaceBetween)
  const [pagination, setpPagination] = useState(false)
  const [navigation, setNavigation] = useState(false)

  const breakpoint = useBreakPointMediaQuery()
  useEffect(() => {
    switch (breakpoint) {
      case BreakPoint.SM:
        setSlidesPerView(1)
        break
      case BreakPoint.MD:
        setSlidesPerView(2)
        break
      case BreakPoint.LG:
        setSlidesPerView(3)
        break
      case BreakPoint.XL:
        setSlidesPerView(defaultSlidesPerViewXL)
        break
      case BreakPoint.XL2:
        setSlidesPerView(defaultSlidesPerViewXL2)
        break
      default:
        setSlidesPerView(1)
    }
  }, [breakpoint, defaultSlidesPerViewXL])

  useMemo(() => {
    if (isTouch) {
      setpPagination(true)
      setNavigation(false)
    } else {
      if (slidesPerView == 2) {
        setpPagination(true)
        setNavigation(false)
      } else {
        setpPagination(false)
        setNavigation(true)
      }
    }
  }, [isTouch, slidesPerView])
  return (
    <div
      className={classNames(
        feature !== HotCollectionFeature.SEARCH ? 'container' : 'w-full',
        feature == HotCollectionFeature.EXPLORE ? 'mt-12' : '',
        feature == HotCollectionFeature.HOME ? 'mt-32' : ''
      )}
    >
      {feature !== HotCollectionFeature.SEARCH && (
        <>
          <div className="flex flex-row justify-start w-full px-6">
            <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Hot Collection`)}</h1>
          </div>
        </>
      )}
      {loading ? (
        <>
          <div className={classNames('py-12', feature !== HotCollectionFeature.SEARCH ? 'px-6' : '')}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <ItemSkeleton></ItemSkeleton>
              <ItemSkeleton></ItemSkeleton>
              <ItemSkeleton></ItemSkeleton>
              <ItemSkeleton></ItemSkeleton>
              <ItemSkeleton></ItemSkeleton>
            </div>
          </div>
        </>
      ) : (
        <>
          {list && list.length ? (
            <>
              <div className="px-6">
                <Swiper
                  // install Swiper modules
                  modules={[Navigation, Pagination]}
                  spaceBetween={spaceBetween}
                  slidesPerView={slidesPerView}
                  //   navigation
                  pagination={pagination}
                  navigation={navigation}
                  // scrollbar={{ draggable: true }}
                  // onSwiper={(swiper) => console.log(swiper)}
                  // onSlideChange={() => console.log('slide change')}
                  //   autoplay
                  //   loop
                >
                  {list.map((item) => {
                    return (
                      <SwiperSlide className="pt-12 pb-12" key={`${item.address}/hotcollection`}>
                        <div className="box-border w-full">
                          <Item data={item} />
                        </div>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            </>
          ) : (
            <>
              <NoData></NoData>
            </>
          )}
        </>
      )}
    </div>
  )
}
export default HotCollection
