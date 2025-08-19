// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { usePosts } from 'app/services/apis/hooks'
import { Posts } from 'app/types/daidai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
// import required modules
import { Pagination } from 'swiper'
import { Autoplay } from 'swiper'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

const Event = () => {
  const { data } = usePosts()
  const { locale } = useRouter()
  const { i18n } = useLingui()
  // console.log('Event', data, data?.length, locale)

  const getTitle = (posts: Posts) => {
    if (locale === 'en') {
      return posts.title
    }
    if (locale === 'ja') {
      return posts.title_jp ?? posts.title
    }
    if (locale === 'zh_CN' || locale === 'zh_TW') {
      return posts.title_cn ?? posts.title
    }
    return posts.title
  }

  const getSubtitle = (posts: Posts) => {
    if (locale === 'en') {
      return posts.subtitle
    }
    if (locale === 'ja') {
      return posts.subtitle_jp ?? posts.subtitle
    }
    if (locale === 'zh_CN' || locale === 'zh_TW') {
      return posts.subtitle_cn ?? posts.subtitle
    }
    return posts.subtitle
  }

  // const demoUrl = 'https://ipfstest.daidai.io/ipfs/QmQY4M53yZCXurUHr7oQ3E78Lsme4vkJoPJLt2ErPu6A5G'
  const render = (posts: Posts) => {
    return (
      <Link href={`/event/${posts.id}`}>
        <a className="w-full">
          <div className="relative flex w-full h-40 md:h-72">
            <div className="absolute inset-0 overflow-hidden bg-base-300">
              <div className="pb-[25%] h-0">
                <Image
                  src={posts.image_url ?? defaultImg}
                  alt="collection banner"
                  layout="fill"
                  className="object-cover"
                  quality={100}
                />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                }}
              ></div>
            </div>
            <div className="box-border absolute inset-0 w-full">
              <div className="flex flex-col justify-between w-full h-full p-4">
                <div className="flex flex-row justify-start w-full">
                  <Typography className="text-base text-base-100 md:text-lg" weight={700}>
                    {getSubtitle(posts)}
                  </Typography>
                </div>
                <div className="flex flex-col justify-center flex-grow">
                  <div className="flex flex-row justify-start w-full">
                    <Typography className="text-2xl !leading-7 text-base-100 md:text-3xl text-left" weight={700}>
                      {getTitle(posts)}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-row justify-end">
                  <Typography className="text-sm underline text-base-100 md:text-base" weight={700}>
                    {i18n._(t`See more`)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    )
  }
  return (
    <>
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        className="w-full h-full mt-8"
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        loop
      >
        {data?.map((posts) => {
          return (
            <>
              <SwiperSlide>{render(posts)}</SwiperSlide>
            </>
          )
        })}
      </Swiper>
    </>
  )
}
export default Event
