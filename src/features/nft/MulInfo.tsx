import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { NFTDetail } from 'app/types/daidai'

const MulInfo = ({ list }: { list: NFTDetail[] }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {list.map((data) => {
          return (
            <>
              <div className="flex flex-col item-center">
                <div>
                  <Image
                    src={data?.image ?? defaultImg}
                    alt="nft image"
                    layout="responsive"
                    width={510}
                    height={510}
                    className="rounded-md"
                  />
                </div>
                <div className="flex flex-row justify-center mt-2">
                  <Typography variant="sm">#{data.tokenId}</Typography>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default MulInfo
