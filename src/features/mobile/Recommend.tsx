import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { BadgeCheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AutoFitImage from 'app/components/AutoFitImage'
import NoData from 'app/components/NoData'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { Collection } from 'app/types/daidai'
import React from 'react'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const Event = ({ list }: { list?: Collection[] }) => {
  const { i18n } = useLingui()

  return (
    <>
      <div className="flex flex-row justify-start mt-8">
        <Typography className="text-sm" weight={700}>
          {i18n._(t`Interesting Collections`)}
        </Typography>
      </div>
      {list && list.length ? (
        <>
          <div className="mt-4">
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={'auto'}
              pagination={false}
              navigation={false}
            >
              {list.map((item) => {
                return (
                  <SwiperSlide className="!w-[60px]" key={`${item.address}/hotcollection`}>
                    <div className="box-border flex flex-col items-center justify-center w-[60px]">
                      <div className="indicator">
                        <div className="avatar">
                          <div className="w-[60px] h-[60px] rounded-full">
                            <AutoFitImage
                              imageUrl={item.avatar ?? defaultImg}
                              defaultWidthStyle={'60px'}
                              defaultHeightStyle={'60px'}
                              roundedClassName="rounded-full"
                            ></AutoFitImage>
                          </div>
                        </div>
                        {item.is_verified == 1 && (
                          <>
                            <span className="indicator-item indicator-bottom indicator-end bottom-2 right-2">
                              <BadgeCheckIcon className="w-4 text-info" />
                            </span>
                          </>
                        )}
                      </div>
                      <Typography className="!text-xs mt-2 text-center w-[60px]" weight={700}>
                        {item.name}
                      </Typography>
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
  )
}
export default Event
