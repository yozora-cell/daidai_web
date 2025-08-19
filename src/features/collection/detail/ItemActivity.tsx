import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { getExplorerLink, isAddress, shortenAddress } from 'app/functions'
import { useNFTTransactions } from 'app/services/apis/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail } from 'app/types/daidai'
import Link from 'next/link'
import { useMemo, useState } from 'react'

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

const ItemActivity = ({ data }: { data: NFTDetail }) => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()

  const findToken = useTokenByAddressCallback()

  const limit = 20
  const [page, setPage] = useState(1)
  const pageNeighbours = 1
  const queryData = useNFTTransactions(data.contract ?? '', Number(data.tokenId), page, limit)
  const list = useMemo(() => {
    if (queryData && queryData.data && queryData.data.data) {
      return queryData.data.data
    }
    return []
  }, [queryData])
  // console.log('list', list)
  const count = useMemo(() => {
    return queryData?.data?.count
  }, [queryData])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])
  // console.log('history data', queryData, queryData.history, queryData.history?.transactions)
  return data ? (
    <>
      <div>
        <div tabIndex={1003} className="border collapse collapse-arrow rounded-box border-base-300 bg-base-100">
          <input type="checkbox" className="peer" defaultChecked={true} />
          <div className="collapse-title peer-checked:text-bold">
            <Typography variant="base" weight={700}>
              {i18n._(t`Item Activity`)}
            </Typography>
          </div>
          <div className="collapse-content">
            <div className="overflow-x-auto">
              {list.length > 0 ? (
                <>
                  <table className="table w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="bg-base-100">{i18n._(t`Event`)}</th>
                        <th className="bg-base-100">{i18n._(t`Price`)}</th>
                        <th className="bg-base-100">{i18n._(t`From`)}</th>
                        <th className="bg-base-100">{i18n._(t`To`)}</th>
                        <th className="bg-base-100">{i18n._(t`Date`)}</th>
                        <th className="bg-base-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((item, index) => (
                        <>
                          <tr key={`${item.timestamp}/${item.txid}/${index}`}>
                            <th>{item.orderType}</th>
                            <td>
                              {item.askPrice} {findToken(item.askToken)?.symbol}
                            </td>
                            <td>
                              <Link href={`/account/${item.seller}`}>
                                {isAddress(item.seller) ? <a>{shortenAddress(item.seller)}</a> : <a>{item.seller}</a>}
                              </Link>{' '}
                            </td>
                            <td>
                              <Link href={`/account/${item.buyer}`}>
                                {isAddress(item.buyer) ? <a>{shortenAddress(item.buyer)}</a> : <a>{item.buyer}</a>}
                              </Link>{' '}
                            </td>
                            <td>{new Date(item.timestamp * 1000).toLocaleString()}</td>
                            <td>
                              <a
                                target={'_blank'}
                                href={getExplorerLink(chainId, item.txid, 'transaction')}
                                rel="noreferrer"
                              >
                                <ExternalLinkIcon className="w-4 cursor-pointer" />
                              </a>
                            </td>
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
    <Skeleton></Skeleton>
  )
}
export default ItemActivity
