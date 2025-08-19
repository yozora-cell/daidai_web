import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { BASE_INO_OR_COLLECTION } from 'app/types/daidai'

const Banner = ({ data }: { data: BASE_INO_OR_COLLECTION }) => {
  return (
    <div className="w-full bg-base-300 max-h-[320px] overflow-hidden relative">
      <div className="pb-[25%] h-0">
        <Image
          src={data.banner ? data.banner : defaultImg}
          alt="collection banner"
          layout="fill"
          className="object-cover"
          quality={100}
        />
      </div>
    </div>
  )
}
export default Banner
