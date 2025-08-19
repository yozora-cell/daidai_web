import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import { getExplorerLink, isAddress, shortenAddress } from 'app/functions'
import { useProfileTransactions } from 'app/services/apis/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const Activity = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const findToken = useTokenByAddressCallback()

  const limit = 20
  const [page, setPage] = useState(1)
  const pageNeighbours = 1
  const queryData = useProfileTransactions(account, page, limit)
  const list = useMemo(() => {
    if (queryData && queryData.history && queryData.history.data) {
      return queryData.history.data
    }
    return []
  }, [queryData])
  // console.log('list', list)
  const count = useMemo(() => {
    return queryData?.history?.count
  }, [queryData])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])
  return (
    <>
      {list ? (
        <>
          {list.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
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
                    {list.map((item) => (
                      <>
                        <tr key={`${item.timestamp}/${item.txid}`}>
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
            </>
          ) : (
            <>
              <NoData></NoData>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default Activity
