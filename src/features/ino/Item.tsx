import Davatar from '@davatar/react'
// import { BadgeCheckIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { classNames } from 'app/functions'
import { isAddress } from 'app/functions'
import { formatNumber, shortenAddress } from 'app/functions/format'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { INO, INOStage } from 'app/types/daidai'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import Identicon from 'react-blockies'

import Actions, { ActionsStyle } from './Actions'
import Countdown from './Countdown'
import Label from './Label'

export interface TokenPriceProp {
  token: string
  balance: number
}

// 骨架
export const ItemSkeleton = () => {
  return (
    <div className="border shadow-md card bg-base-100 border-base-300">
      <div className="w-full h-full p-4 animate-pulse">
        <div className="box-border flex flex-row items-center justify-between w-full">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full bg-base-300"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-56 h-5 rounded bg-base-300"></div>
            <div className="w-56 h-5 mt-2 rounded bg-base-300"></div>
          </div>
        </div>
        <div className="w-full py-2">
          <div className="w-full rounded bg-base-300 h-80"></div>
        </div>
        <div className="items-center pt-4">
          <div className="w-full h-6 rounded bg-base-300"></div>
        </div>
      </div>
    </div>
  )
}

const Item = ({ data }: { data: INO }) => {
  // console.log('data', data)
  // const { ENSName } = useENSName(data.owner ?? undefined)
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { i18n } = useLingui()
  // Renderer callback with condition
  const [avaliable, setAvaliable] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [preSaleStartTimestamp, setPreSaleStartTimestamp] = useState(0)
  const [preSaleDiscount, setPreSaleDiscount] = useState(0)
  const [stage, setStage] = useState(INOStage.LOADING)
  const [singal, setSingal] = useState(0)
  return (
    <div
      className="w-full transition border shadow-md card bg-base-100 border-base-300 hover:shadow-xl"
      style={{
        overflow: 'inherit',
      }}
    >
      <div className="box-border flex flex-row items-center justify-between w-full p-4">
        <div className="tooltip" data-tip={isAddress(data.address) ? shortenAddress(data.address) : ''}>
          <div className="indicator">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <Link href={`/ino/${data.chainId}/${data.address}`}>
                  <a>
                    {data.avatar ? (
                      <Image
                        src={data.avatar}
                        alt="avatar"
                        // className="rounded-xl"
                        layout="responsive"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <Davatar
                        size={32}
                        address={data.owner}
                        defaultComponent={<Identicon seed={data.owner} className="!w-8 !h-8 rounded-full" />}
                        provider={library}
                      />
                    )}
                  </a>
                </Link>
              </div>
            </div>
            {data.is_verified == 1 ? (
              <span className="indicator-item indicator-bottom indicator-end bottom-1 right-1">
                <BadgeCheckIcon className="w-4 text-info" />
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end w-8/12">
          <div className="text-right">
            <Typography variant="sm" weight={700}>
              {i18n._(t`Amount`)}
            </Typography>
            {stage == INOStage.PRE_SALE_COMING_SOON || stage == INOStage.PUBLIC_COMING_SOON ? (
              <Typography variant="sm">{totalCount}</Typography>
            ) : (
              <Typography variant="sm">
                {avaliable}/{totalCount}
              </Typography>
            )}
          </div>
          <div
            className={classNames(
              stage == INOStage.PRE_SALE_COMING_SOON || stage == INOStage.PUBLIC_COMING_SOON ? 'hidden' : '',
              'ml-4',
              'text-right'
            )}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Volume`)}
            </Typography>
            <Typography variant="sm">
              {/* {data.floorPrice}{' '} */}
              <Typography variant="sm" weight={700} className="inline-flex">
                {formatNumber(data.totalVolumeETH)}
                {' ETH'}
              </Typography>
            </Typography>
          </div>
        </div>
        {/* <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-base-200">
          <DotsHorizontalIcon className="w-6 cursor-pointer" />
        </div> */}
      </div>
      {/* <figure className="px-4">
        <Image
          src={data.banner ? data.banner : ''}
          alt=""
          // className="rounded-xl"
          layout="responsive"
          width={510}
          height={510}
          className="object-cover object-center"
        />
      </figure> */}
      <div className="relative w-full px-4">
        <Link href={`/ino/${data.chainId}/${data.address}`}>
          <a className="w-full">
            <Image
              src={data ? (data.cover ? data.cover : data.banner ? data.banner : defaultImg) : defaultImg}
              alt=""
              // className="rounded-xl"
              layout="responsive"
              width={510}
              height={510}
              className="object-cover object-center"
            />
          </a>
        </Link>
        <div className="absolute left-0 right-0 text-base-100 top-4">
          <Countdown
            stage={stage}
            startTimestamp={stage == INOStage.PRE_SALE_COMING_SOON ? preSaleStartTimestamp : startTimestamp}
            onEnd={() => {
              // 修改信号来引发inoData的更新
              console.log('countdown end')
              setSingal(singal + 1)
            }}
          />
        </div>
      </div>
      <div className="items-center text-left card-body !p-4">
        <Label stage={stage} isBadge={false} />
        <Link href={`/ino/${data.chainId}/${data.address}`}>
          <a className="w-full mt-2">
            <Typography className="w-full truncate" variant="lg" weight={700}>
              {data.name}
            </Typography>
          </a>
        </Link>
        <Actions
          data={data}
          getInoData={(avaliable, totalCount, stage, startTimestamp, preSaleTimeStamp, preSaleDiscount) => {
            setAvaliable(avaliable)
            setTotalCount(totalCount)
            setStage(stage)
            setStartTimestamp(startTimestamp ?? 0)
            setPreSaleStartTimestamp(preSaleTimeStamp ?? 0)
            setPreSaleDiscount(preSaleDiscount ?? 0)
          }}
          className="card-actions h-14"
          actionsStyle={ActionsStyle.Item}
          singal={singal}
        ></Actions>
      </div>
    </div>
  )
}
export default Item
