import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Dialog, Transition } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Image from 'app/features/common/Image'
import Item, { ItemSkeleton } from 'app/features/nft/Item'
import { BreakPoint, useBreakPointMediaQuery, useTouchDeviceMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { postNftsFind } from 'app/services/apis/fetchers'
import { NFTDetail, SlotsNFT } from 'app/types/daidai'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const getCollectionIds = (data: SlotsNFT[]) => {
  const array: string[] = []
  data.forEach((item) => {
    array.push(`${item.address}-${item.id}`)
  })
  return array
}

const Page = ({ list }: { list: SlotsNFT[] }) => {
  const { i18n } = useLingui()
  const icon = '/images/gacha/icon.png'
  const [nfts, setNfts] = useState<NFTDetail[]>()
  useEffect(() => {
    if (list) {
      const promise = postNftsFind(getCollectionIds(list))
      promise.then((data) => {
        // console.log('test', data)
        if (data) {
          setNfts(data)
        }
      })
    }
  }, [list])
  // console.log('nfts', nfts)

  const isTouch = useTouchDeviceMediaQuery()
  const defaultSlidesPerView = 5
  const defaultSpaceBetween = 20
  const [slidesPerView, setSlidesPerView] = useState(defaultSlidesPerView)
  const [spaceBetween, setSpaceBetween] = useState(defaultSpaceBetween)
  const [pagination, setpPagination] = useState(false)
  const [navigation, setNavigation] = useState(false)

  const [isOpenModal, setIsOpenModal] = useState(false)

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
      if (slidesPerView == 2) {
        setpPagination(true)
        setNavigation(false)
      } else {
        setpPagination(false)
        setNavigation(true)
      }
    }
  }, [isTouch, slidesPerView])

  function closeModal() {
    setIsOpenModal(false)
  }

  const skeleton = (
    <>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
    </>
  )

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full gap-2 pb-2 border-b border-gray-700 border-dotted mt-28">
        <div className="relative w-[32px] h-[36px]">
          <Image src={icon} alt="img" layout="fill" className="object-cover" />
        </div>
        <Typography className="text-2xl md:text-4xl">{i18n._(t`NFT Slots`)}</Typography>
      </div>
      {nfts ? (
        <>
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
            {nfts.map((item) => {
              return (
                <SwiperSlide className="pt-12 pb-12" key={`${item.collection?.address}/nfts`}>
                  <div className="box-border w-full">
                    <Item data={item} />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </>
      ) : (
        <div className="flex flex-row gap-4 py-4">{skeleton}</div>
      )}
      <div className="my-4">
        <button
          disabled={!nfts || nfts.length === 0}
          onClick={() => {
            setIsOpenModal(true)
          }}
          className="btn btn-primary"
        >
          {i18n._(t`View More`)} {nfts && `(${nfts.length})`}
        </button>
      </div>
      <div>
        <Typography className="mt-2 text-base md:text-lg">
          {i18n._(
            t`We've added to the gacha pool a selection of rare NFT collectibles from the DAIDAI marketplace, and they're waiting for a lucky winner!`
          )}
        </Typography>
        <Typography className="mt-4 text-base md:text-lg">
          {i18n._(
            t`If you win an NFT, you can choose to display and sell it in DAIDAI, or you can choose to airdrop him to your friends, or, of course, you can keep it proudly and forever!`
          )}
        </Typography>
      </div>
      {/* 展示奖品 */}
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-8 md:px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className="fixed inset-0"
                style={{
                  background: 'rgba(0, 0, 0, 0.37)',
                  backgroundSize: 'cover',
                }}
              />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full p-4 my-8 overflow-hidden text-left align-middle transition-all transform border shadow-xl bg-base-100 rounded-2xl max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
                  {isOpenModal &&
                    nfts &&
                    nfts.map((item) => {
                      return (
                        <div key={item.id} className="box-border w-full">
                          <Item data={item} />
                        </div>
                      )
                    })}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Page
