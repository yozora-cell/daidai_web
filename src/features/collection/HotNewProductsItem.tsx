import { BadgeCheckIcon } from '@heroicons/react/solid'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { Collection } from 'app/types/daidai'
import Link from 'next/link'

const Item = ({ data }: { data: Collection }) => {
  return (
    <Link href={`/collection/${data.chainId}/${data.address}`}>
      <a className="w-full">
        <div className="w-full transition border border-[#F2F2F5] card bg-base-100 hover:shadow-lg">
          <div className="relative flex w-full h-[74px]">
            <div className="absolute inset-0 overflow-hidden bg-base-100">
              <div className="pb-[25%] h-0">
                <Image
                  src={data.banner ?? defaultImg}
                  alt="collection banner"
                  layout="fill"
                  className="object-cover"
                  quality={100}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full items-center p-2 text-center -mt-[28px] box-border">
            <div className="indicator">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-1">
                  <Image
                    src={data.avatar ?? defaultImg}
                    alt="avatar"
                    // className="rounded-xl"
                    layout="responsive"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              {data.is_verified == 1 && (
                <>
                  <span className="indicator-item indicator-bottom indicator-end bottom-1 right-1">
                    <BadgeCheckIcon className="w-4 text-info" />
                  </span>
                </>
              )}
            </div>
            <Typography variant="base" className="w-full truncate !text-xs mt-2" weight={700}>
              {data.name}
            </Typography>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Item
