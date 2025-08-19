import AutoFitImage from 'app/components/AutoFitImage'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { BASE_INO_OR_COLLECTION } from 'app/types/daidai'

const Picture = ({ data }: { data: BASE_INO_OR_COLLECTION }) => {
  return (
    <div>
      {data && data.cover ? (
        <AutoFitImage
          imageUrl={data.cover}
          defaultWidthStyle={'100%'}
          defaultHeightStyle={'510'}
          roundedClassName={''}
        ></AutoFitImage>
      ) : (
        <Image src={defaultImg} alt="" layout="responsive" width={510} height={510} />
      )}
    </div>
  )
}
export default Picture
