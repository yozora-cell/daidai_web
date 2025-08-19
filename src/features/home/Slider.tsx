// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import React from 'react'
import { Navigation } from 'swiper'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

const Slider = () => {
  return (
    <>
      <Swiper
        // install Swiper modules
        modules={[Navigation]}
        // spaceBetween={50}
        // slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
        autoplay
        loop
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </>
  )
}
export default Slider
