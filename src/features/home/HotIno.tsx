import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
// import PleaseSignIn from 'app/components/PleaseSignIn'
// import { ChainId } from '@sushiswap/core-sdk'
import Item, { ItemSkeleton } from 'app/features/ino/Item'
import { classNames } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery, useTouchDeviceMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import { INO } from 'app/types/daidai'
// import Button from 'app/components/Button'
// import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
// import { isMobile } from 'react-device-detect'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const Page = ({ list, loading }: { list: INO[] | undefined; loading: boolean }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  return (
    <>
      <HotIno list={list} loading={loading}></HotIno>
      {/* {account ? (
        <>
          <HotIno list={list} loading={loading}></HotIno>
        </>
      ) : (
        <>
          <div className="container mt-8">
            <div className="flex flex-row justify-start w-full px-6">
              <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Hot INO`)}</h1>
            </div>
            <PleaseSignIn></PleaseSignIn>
          </div>
        </>
      )} */}
    </>
  )
}

const HotIno = ({ list, loading }: { list: INO[] | undefined; loading: boolean }) => {
  // console.log('hot ino list', list)
  const { i18n } = useLingui()
  const isTouch = useTouchDeviceMediaQuery()
  const breakpoint = useBreakPointMediaQuery()
  const defaultSlidesPerView = 3
  const defaultSpaceBetween = 10
  const [slidesPerView, setSlidesPerView] = useState(defaultSlidesPerView)
  const [spaceBetween, setSpaceBetween] = useState(defaultSpaceBetween)
  const [pagination, setpPagination] = useState(false)
  const [navigation, setNavigation] = useState(false)
  // const [touchMoveStopPropagation, setTouchMoveStopPropagation] = useState(false)
  // const defaultChainId = ChainId.BSC_TESTNET
  useEffect(() => {
    switch (breakpoint) {
      case BreakPoint.SM:
        setSlidesPerView(1)
        break
      case BreakPoint.MD:
        setSlidesPerView(2)
        break
      case BreakPoint.LG:
        setSlidesPerView(2)
        break
      case BreakPoint.XL:
        setSlidesPerView(defaultSlidesPerView)
        break
      case BreakPoint.XL2:
        setSlidesPerView(defaultSlidesPerView)
        break
      default:
        setSlidesPerView(1)
    }
  }, [breakpoint])

  useMemo(() => {
    if (isTouch) {
      setpPagination(true)
      setNavigation(false)
    } else {
      if (slidesPerView == 1) {
        setSpaceBetween(0)
        setpPagination(true)
        setNavigation(false)
      } else {
        setSpaceBetween(defaultSpaceBetween)
        setpPagination(false)
        setNavigation(true)
      }
    }
  }, [slidesPerView, isTouch])
  return (
    <div className="container mt-8">
      <div className="flex flex-row justify-start w-full px-6">
        <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Live INO`)}</h1>
      </div>
      {!loading && list && list.length ? (
        <div className="mt-4">
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            //   navigation
            pagination={pagination}
            navigation={navigation}
            autoplay={false}
            // scrollbar={{ draggable: true }}
            // onSwiper={(swiper) => console.log(swiper)}
            // onSlideChange={() => console.log('slide change')}
            //   autoplay
            //   loop
            // touchMoveStopPropagation={touchMoveStopPropagation}
            // simulateTouch={false}
            allowTouchMove={isTouch}
          >
            {list.map((item) => {
              return (
                <SwiperSlide className="pb-4" key={`${item.address}/hotino`}>
                  <div className="box-border w-full p-6">
                    <Item data={item} />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      ) : (
        <></>
      )}
      {!loading && list && list.length == 0 ? (
        <>
          <NoData></NoData>
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            <div className={classNames('box-border p-6 w-full')}>
              <ItemSkeleton></ItemSkeleton>
            </div>
            <div className={classNames('box-border p-6 w-full')}>
              <ItemSkeleton></ItemSkeleton>
            </div>
            <div className={classNames('box-border p-6 w-full')}>
              <ItemSkeleton></ItemSkeleton>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
export default Page
