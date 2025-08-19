import { BadgeCheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import Image from 'app/features/common/Image'
import Actions, { ButtonStyle } from 'app/features/nft/Actions'
import { shortenAddress } from 'app/functions'
import { isAddress } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useChainId } from 'app/state/application/hooks'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail } from 'app/types/daidai'
import Link from 'next/link'
import { useMemo } from 'react'

// 骨架
export const ItemSkeleton = () => {
  return (
    <div className="box-border w-full p-3 border rounded-md bg-base-100 border-base-300">
      <div className="w-full h-full animate-pulse">
        <div className="w-full h-10 bg-base-300"></div>
        <div className="w-full mt-3 rounded bg-base-300 h-52"></div>
        <div className="w-full h-5 mt-3 rounded bg-base-300"></div>
        <div className="w-full h-6 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-5 mt-1 rounded bg-base-300"></div>
      </div>
    </div>
  )
}

const Item = ({
  data,
  swrKey,
  onSuccess,
  onClose,
}: {
  data: NFTDetail
  swrKey?: string | undefined
  onSuccess?: () => void
  onClose?: () => void
}) => {
  const { i18n } = useLingui()
  const { account, library } = useActiveWeb3React()
  const chainId = useChainId()

  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])
  const findToken = useTokenByAddressCallback()
  const targetToken = useMemo(() => {
    if (chainId && listingItem) {
      const tokenAddress = listingItem.payToken
      return findToken(tokenAddress)
    } else {
      return undefined
    }
  }, [chainId, findToken, listingItem])

  const creatorTip = `${i18n._(t`Creator`)}: `
  const ownerTip = `${i18n._(t`Owner`)}: `
  const collectionTip = `${i18n._(t`Collection`)}: `
  const collectionAddress = data ? data.contract : ''

  const getAvatarLink = (
    address: string,
    imgurl: string | undefined,
    tip: string,
    urlprefix: string,
    is_verified: number
  ) => {
    return (
      <>
        <div
          className="transition ease-in tooltip hover:z-10 hover:-translate-y-2"
          data-tip={isAddress(address) ? `${tip}${shortenAddress(address)}` : `${tip}Unknown`}
        >
          <div className="indicator">
            <div className="avatar">
              <div className="w-6 rounded-full bg-base-100">
                <Link href={`${urlprefix}/${address}`}>
                  <a>
                    <Image
                      src={imgurl ?? defaultImg}
                      alt="nft image"
                      layout="responsive"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </a>
                </Link>
              </div>
            </div>
            {is_verified == 1 ? (
              <span className="indicator-item indicator-bottom indicator-end bottom-1 right-[8px]">
                <BadgeCheckIcon className="w-4 text-info" />
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="box-border w-[150px] transition rounded-md bg-base-100">
      <div className="box-border flex flex-row items-center justify-between w-full">
        <div className="-space-x-6 avatar-group !overflow-visible">
          {getAvatarLink(
            collectionAddress ?? '',
            data.collection?.avatar,
            collectionTip,
            `/collection/${chainId}`,
            data.collection?.is_verified ?? 0
          )}
        </div>

        {/* <div className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-base-200">
          <DotsHorizontalIcon className="w-6 cursor-pointer" />
        </div> */}
      </div>
      <div className="w-[150px] mt-1">
        <Link href={`/collection/${data?.chainId}/${data?.contract}/${data?.tokenId}`}>
          <a className="w-full">
            {data && data.image ? (
              <>
                <div className="relative flex w-[150px] h-[150px] rounded">
                  <div className="absolute inset-0 overflow-hidden rounded bg-base-100">
                    <div className="pb-[25%] h-0">
                      <Image
                        src={data.image ?? defaultImg}
                        alt="collection banner"
                        layout="fill"
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-md w-full h-[250px] max-w-full max-h-[250px] bg-base-300"></div>
              </>
            )}
          </a>
        </Link>
      </div>
      <div className="w-full mt-2">
        <div className="w-full indicator">
          <span className="flex flex-row items-center justify-center indicator-item indicator-middle right-3">
            {/* <ETHIcon className="w-6 h-6"></ETHIcon> */}
            <div className="tooltip" data-tip={chainId ? NETWORK_LABEL[chainId] : 'Unknown'}>
              <Image
                src={
                  data.chainId && Number(data.chainId) in NETWORK_ICON ? NETWORK_ICON[Number(data.chainId)] : defaultImg
                }
                alt={
                  data.chainId && Number(data.chainId) in NETWORK_LABEL
                    ? NETWORK_LABEL[Number(data.chainId)]
                    : 'Unknown'
                }
                className="rounded-full"
                width="20px"
                height="20px"
              />
            </div>
          </span>
          <Link href={`/collection/${data?.chainId}/${data?.contract}/${data?.tokenId}`}>
            <a className="w-full">
              <div
                className="flex flex-row justify-start w-full text-left tooltip"
                // data-tip={`${data?.collectionName} #${data?.tokenId}`}
                data-tip={`${data?.name}`}
              >
                <Typography variant="base" className="w-10/12 truncate !text-sm" weight={700}>
                  {data?.name}
                </Typography>
              </div>
            </a>
          </Link>
        </div>
      </div>
      <div className="w-full">
        {listingItem && targetToken ? (
          <Typography variant="sm" className="inline-flex !text-xs" weight={700}>
            {listingItem.price} {targetToken?.symbol}
          </Typography>
        ) : (
          <Typography variant="sm" className="inline-flex !text-xs" weight={700}>
            &nbsp;
          </Typography>
        )}
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <Actions
          buttonStyle={ButtonStyle.TEXT}
          listingItem={listingItem}
          collection={data.contract}
          tokenId={Number(data.tokenId)}
          data={data}
          swrKey={swrKey}
          onSuccess={onSuccess}
          onClose={onClose}
          className="!text-sm"
        ></Actions>
        {/* <div className="flex flex-row items-center">
          <HeartIcon className="w-4 cursor-pointer"></HeartIcon>
          <Typography variant="sm" className="ml-2 text-base-content" weight={700}>
            0
          </Typography>
        </div> */}
      </div>
    </div>
  )
}
export default Item
