import { BadgeCheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { formatNumber } from 'app/functions'
import { Collection } from 'app/types/daidai'
import Link from 'next/link'

const Item = ({ data }: { data: Collection }) => {
  const { i18n } = useLingui()

  return (
    <Link href={`/collection/${data.chainId}/${data.address}`}>
      <a className="w-full">
        <div className="w-full transition border border-[#F2F2F5] card bg-base-100 hover:shadow-lg">
          <div className="relative flex w-full h-[70px]">
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
          <div className="w-full -mt-[14px] p-2 box-border">
            <div className="flex flex-row items-center justify-start w-full gap-2">
              <div className="indicator">
                <div className="avatar">
                  <div className="w-[36px] rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-1">
                    <Image
                      src={data.avatar ?? defaultImg}
                      alt="avatar"
                      // className="rounded-xl"
                      layout="responsive"
                      width={36}
                      height={36}
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
              <Typography variant="base" className="w-full truncate grow-0 !text-xs !z-10" weight={700}>
                {data.name}
              </Typography>
            </div>
            <div className="flex flex-row justify-end w-full">
              <Typography variant="sm" className="text-opacity-50 !text-xs">
                {i18n._(t`Floor Price`)}
                {` `}
                {formatNumber(data.totalVolumeETH)} ETH
              </Typography>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Item
