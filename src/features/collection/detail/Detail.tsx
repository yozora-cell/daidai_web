import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import Image from 'app/features/common/Image'
import { shortenAddress } from 'app/functions'
import { isAddress } from 'app/functions'
import useNFT from 'app/hooks/useNFT'
import { useActiveWeb3React } from 'app/services/web3'
import { NFTDetail } from 'app/types/daidai'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Skeleton = () => {
  return (
    <div className="box-border w-full p-3 border rounded-md bg-base-100 border-base-300">
      <div className="w-full h-full animate-pulse">
        <div className="w-full h-10 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
      </div>
    </div>
  )
}

const Detail = ({ data }: { data: NFTDetail }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const { ownerOf } = useNFT(data.contract ?? '')
  const [owner, setOwner] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (data && data.SellList && data.SellList.length > 0 && data.SellList[0].address != AddressZero) {
      setOwner(data.SellList[0].address)
    } else {
      if (account && data.tokenId != undefined) {
        const promise = ownerOf(
          Number(data.tokenId),
          data.SellList && data.SellList.length > 0 ? data.SellList[0].address : ''
        )
        promise.then((result) => {
          setOwner(result)
        })
      }
    }
  }, [account, data, ownerOf])
  return data ? (
    <div>
      <div tabIndex={1001} className="border collapse collapse-arrow rounded-box border-base-300 bg-base-100">
        <input type="checkbox" className="peer" defaultChecked={true} />
        <div className="collapse-title peer-checked:text-bold">
          <Typography variant="base" weight={700}>
            {i18n._(t`Detail`)}
          </Typography>
        </div>
        <div className="p-0 collapse-content">
          <div className="flex items-center justify-between px-4 py-2 border-b border-b-base-300">
            <Typography variant="base" className="text-primary text-opacity-60">
              {i18n._(t`Creator`)}
            </Typography>
            <div className="flex flex-row items-center justify-end">
              {data && data.creator && isAddress(data.creator) ? (
                <Link href={`/account/${data.creator}`}>
                  <a>
                    <Typography className="text-primary">{shortenAddress(data.creator)}</Typography>
                  </a>
                </Link>
              ) : (
                <Typography className="text-primary">{i18n._(t`Unknown`)}</Typography>
              )}
            </div>
          </div>
          {owner ? (
            <div className="flex items-center justify-between px-4 py-2 border-b border-b-base-300">
              <Typography variant="base" className="text-primary text-opacity-60">
                {i18n._(t`Owner`)}
              </Typography>
              <div className="flex flex-row items-center justify-end">
                <Link href={`/account/${owner}`}>
                  <a>
                    <Typography className="text-primary">
                      {isAddress(owner) ? shortenAddress(`${owner}`) : 'unknown'}
                    </Typography>
                  </a>
                </Link>{' '}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex items-center justify-between px-4 py-2 border-b border-b-base-300">
            <Typography variant="base" className="text-primary text-opacity-60">
              {i18n._(t`Network`)}
            </Typography>
            <div className="flex flex-row items-center justify-end gap-2">
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
                width="24px"
                height="24px"
              />
              <Typography className="text-primary">
                {data.chainId && Number(data.chainId) in NETWORK_LABEL
                  ? NETWORK_LABEL[Number(data.chainId)]
                  : 'Unknown'}
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-b border-b-base-300">
            <Typography variant="base" className="text-primary text-opacity-60">
              {i18n._(t`Contract Address`)}
            </Typography>
            <div className="flex flex-row items-center justify-end">
              {data && data.contract && isAddress(data.contract) ? (
                <Link href={`/collection/${data.chainId}/${data.contract}`}>
                  <a>
                    <Typography className="text-primary">{shortenAddress(data.contract)}</Typography>
                  </a>
                </Link>
              ) : (
                <Typography className="text-primary">{i18n._(t`Unknown`)}</Typography>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <Typography variant="base" className="text-primary text-opacity-60">
              {i18n._(t`Token ID`)}
            </Typography>
            <div className="flex flex-row items-center justify-end">
              <Typography className="text-primary">#{data.tokenId}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Skeleton></Skeleton>
  )
}
export default Detail
