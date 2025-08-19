import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Typography from 'app/components/Typography'
import NewArrivalItem from 'app/features/collection/NewArrivaItem'
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
          {i18n._(t`Recently Listed`)}
        </Typography>
      </div>
      {list && list.length ? (
        <>
          <div className="">
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={'auto'}
              pagination={false}
              navigation={false}
            >
              {list.map((item) => {
                return (
                  <SwiperSlide className="!w-[192px] pt-6 pb-6" key={`${item.address}/hotcollection`}>
                    <div className="w-[192px]">
                      <NewArrivalItem data={item} />
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
