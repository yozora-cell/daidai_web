import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { shortenAddress } from 'app/functions'
import { isAddress } from 'app/functions'
import useNFT from 'app/hooks/useNFT'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail } from 'app/types/daidai'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

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

const Owner = ({ data }: { data: NFTDetail }) => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()

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
  const findToken = useTokenByAddressCallback()
  const targetToken = useMemo(() => {
    if (chainId && data.SellList && data.SellList.length > 0) {
      const tokenAddress = data.SellList[0].payToken
      return findToken(tokenAddress)
    } else {
      return undefined
    }
  }, [chainId, data.SellList, findToken])

  const [isClicked, setIsClicked] = useState(false)
  return data ? (
    <div>
      <div tabIndex={1003} className="border collapse collapse-arrow rounded-box border-base-300 bg-base-100">
        <input type="checkbox" className="peer" defaultChecked={true} />
        <div className="collapse-title peer-checked:text-bold">
          <Typography variant="base" weight={700}>
            {i18n._(t`Owner`)}
          </Typography>
        </div>
        <div className="collapse-content">
          <table className="table w-full">
            <thead className="border-b">
              <tr>
                <th className="bg-base-100">{i18n._(t`Price`)}</th>
                <th className="bg-base-100">{i18n._(t`Owner`)}</th>
                <th className="bg-base-100"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {data.SellList && data.SellList.length > 0 ? data.SellList[0].price : ''} {targetToken?.symbol}
                </td>
                <td>
                  {owner ? (
                    <>
                      <Link href={`/account/${owner}`}>
                        <a>{isAddress(owner) ? shortenAddress(`${owner}`) : 'unknown'}</a>
                      </Link>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Skeleton></Skeleton>
  )
}
export default Owner
