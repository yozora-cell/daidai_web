import 'swiper/css'
import 'swiper/css/autoplay'

import { BellIcon } from '@heroicons/react/solid'
import Typography from 'app/components/Typography'
import { useMedium } from 'app/services/apis/hooks'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const Medium = () => {
  const { data } = useMedium()
  //   console.log('medium data', data)
  const dateGen = (ts: number) => {
    const date = new Date(ts)

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
  return (
    <>
      <div className="w-full px-6 mt-4">
        <div className="px-4 py-2 mx-auto shadow-md w-fit">
          <Swiper
            // install Swiper modules
            //   spaceBetween={spaceBetween}
            //   slidesPerView={slidesPerView}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            loop
            direction="vertical"
            className="mx-auto h-7 w-fit"
            modules={[Autoplay]}
          >
            {data &&
              data.map((item) => {
                return (
                  <SwiperSlide className="flex flex-col items-center justify-center" key={`${item.mediumUrl}/medium`}>
                    <div className="box-border flex flex-row items-center justify-between w-full gap-4">
                      <div className="flex flex-row items-center justify-start gap-2">
                        <BellIcon className="w-4 h-4"></BellIcon>
                        <a href={item.mediumUrl} target="_blank" rel="noreferrer">
                          <Typography
                            className="max-w-[180px] truncate sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
                            weight={700}
                            variant="sm"
                          >
                            {item.title}
                          </Typography>
                        </a>
                      </div>
                      <Typography className="text-primary text-opacity-30 whitespace-nowrap" variant="sm">
                        {dateGen(item.latestPublishedAt)}
                      </Typography>
                    </div>
                  </SwiperSlide>
                )
              })}
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default Medium
