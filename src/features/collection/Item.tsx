import Davatar from '@davatar/react'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { formatNumber } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { Collection } from 'app/types/daidai'
import Link from 'next/link'
import Identicon from 'react-blockies'

export const ItemSkeleton = () => {
  return (
    <div className="w-full border card bg-base-100">
      <div className="w-full h-full animate-pulse">
        <div className="w-full p-2">
          <div className="p-2">
            <Image
              src={defaultImg}
              alt="collection banner"
              // className="rounded-xl"
              layout="responsive"
              width={1400}
              height={400}
            />
          </div>
        </div>
        <div className="items-center w-full p-4 text-center -mt-14 card-body">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
              <Image
                src={defaultImg}
                alt="avatar"
                // className="rounded-xl"
                layout="responsive"
                width={64}
                height={64}
              />
            </div>
          </div>
          <div className="w-full h-4 mt-1 rounded bg-base-300"></div>
          <div className="w-full h-4 mt-1 rounded bg-base-300"></div>
        </div>
      </div>
    </div>
  )
}

const Item = ({ data }: { data: Collection }) => {
  const { account, chainId, library } = useActiveWeb3React()
  return (
    <Link href={`/collection/${data.chainId}/${data.address}`}>
      <a className="w-full">
        <div className="w-full transition border card bg-base-100 hover:shadow-lg">
          <div className="p-2">
            <Image
              src={data.banner ? data.banner : defaultImg}
              alt="collection banner"
              // className="rounded-xl"
              layout="responsive"
              width={1400}
              height={400}
            />
          </div>
          <div className="items-center w-full p-4 text-center -mt-14 card-body">
            <div className="indicator">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
                  {data.avatar ? (
                    <Image
                      src={data.avatar}
                      alt="avatar"
                      // className="rounded-xl"
                      layout="responsive"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <Davatar
                      size={64}
                      address={data.owner}
                      defaultComponent={<Identicon seed={data.owner} className="!w-16 !h-16 rounded-full" />}
                      provider={library}
                    />
                  )}
                </div>
              </div>
              {data.is_verified == 1 && (
                <>
                  <span className="indicator-item indicator-bottom indicator-end bottom-2 right-2">
                    <BadgeCheckIcon className="w-4 text-info" />
                  </span>
                </>
              )}
            </div>
            <Typography variant="base" className="w-full truncate text-base-content" weight={700}>
              {data.name}
            </Typography>
            <Typography variant="sm" className="text-opacity-50 text-base-content">
              {formatNumber(data.totalVolumeETH)} ETH
            </Typography>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Item
