import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import AcceptOfferAction from 'app/features/nft/AcceptOfferAction'
import { formatDateAgo, formatDateFuture, isAddress, shortenAddress } from 'app/functions'
import useNFT from 'app/hooks/useNFT'
import { useBuyOrderList } from 'app/services/apis/hooks'
import { buyOrderList } from 'app/services/apis/keys'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail } from 'app/types/daidai'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const OfferList = ({ data }: { data: NFTDetail }) => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const { ownerOf } = useNFT(data.contract ?? '')
  const [owner, setOwner] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (account && data.tokenId != undefined) {
      const promise = ownerOf(
        Number(data.tokenId),
        data.SellList && data.SellList.length > 0 ? data.SellList[0].address : ''
      )
      promise.then((result) => {
        setOwner(result)
      })
    }
  }, [account, data.SellList, data.tokenId, ownerOf])
  const isOwner = useMemo(() => {
    if (!account) {
      return false
    }
    return String(owner).toLocaleLowerCase() == account.toLocaleLowerCase()
  }, [account, owner])

  const findToken = useTokenByAddressCallback()

  const limit = 20
  const [page, setPage] = useState(1)
  const pageNeighbours = 1
  const queryData = useBuyOrderList(data.contract ?? '', Number(data.tokenId))
  const list = useMemo(() => {
    if (queryData && queryData.data) {
      return queryData.data
    }
    return []
  }, [queryData])
  // console.log('list', list)
  const count = useMemo(() => {
    return queryData?.data?.length
  }, [queryData])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])
  // console.log('history data', queryData, queryData.history, queryData.history?.transactions)

  const dateRender = (expiration: number) => {
    const time = expiration * 1000
    const date = new Date(time)
    const nowTime = new Date().getTime()
    // 还未过期
    if (time >= nowTime) {
      return formatDateFuture(date)
    } else {
      return formatDateAgo(date)
    }
  }

  const swrKey = useMemo(() => {
    return chainId && data.contract
      ? buyOrderList({
          chainId: chainId,
          collection: data.contract,
          tokenId: Number(data.tokenId),
        })
      : undefined
  }, [chainId, data.contract, data.tokenId])

  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])

  return data ? (
    <>
      <div>
        <div tabIndex={1003} className="border collapse collapse-arrow rounded-box border-base-300 bg-base-100">
          <input type="checkbox" className="peer" defaultChecked={true} />
          <div className="collapse-title peer-checked:text-bold">
            <Typography variant="base" weight={700}>
              {i18n._(t`Offer`)}
            </Typography>
          </div>
          <div className="collapse-content">
            <div className="overflow-x-auto">
              {list.length > 0 ? (
                <>
                  <table className="table w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="bg-base-100">{i18n._(t`Price`)}</th>
                        <th className="bg-base-100">{i18n._(t`Expiration`)}</th>
                        <th className="bg-base-100">{i18n._(t`From`)}</th>
                        {isOwner && (
                          <>
                            <th className="bg-base-100"></th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((item, index) => (
                        <>
                          <tr key={`${index}`}>
                            <th>
                              {item.price}
                              {` `}
                              {findToken(item.payToken)?.symbol}
                            </th>
                            <td>
                              {/* <div className="tooltip" data-tip={new Date(item.expiration * 1000).toLocaleString()}>
                                {dateRender(item.expiration)}
                              </div> */}
                              {dateRender(item.expiration)}
                            </td>
                            <td>
                              <Link href={`/account/${item.address}`}>
                                {isAddress(item.address) ? (
                                  <a>{shortenAddress(item.address)}</a>
                                ) : (
                                  <a>{item.address}</a>
                                )}
                              </Link>{' '}
                            </td>
                            {isOwner && (
                              <>
                                <td>
                                  <div className="flex flex-row justify-end w-full">
                                    <AcceptOfferAction
                                      offerData={item}
                                      collection={data.contract}
                                      tokenId={Number(data.tokenId)}
                                      data={data}
                                      swrKey={swrKey}
                                      listingItem={listingItem}
                                    ></AcceptOfferAction>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <NoData></NoData>
                </>
              )}
            </div>
            <div className="flex flex-row justify-center mt-8">
              <Pagination
                totalPages={totalPage}
                onChange={(index) => {
                  setPage(index + 1)
                }}
                currentPage={page - 1}
                pageNeighbours={pageNeighbours}
                canNextPage={!(page == totalPage)}
                canPreviousPage={!(page == 1)}
              ></Pagination>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  )
}
export default OfferList
