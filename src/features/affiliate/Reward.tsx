import { InformationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useAffiliateHistory } from 'app/services/apis'
import { affiliateHistory } from 'app/services/apis/keys'
import { useAccount } from 'app/state/application/hooks'
import { AffiliateHistoryStatus } from 'app/types/daidai'
import { useCallback, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import RewardCard from './RewardCard'
import WithdrawAmount from './WithdrawAmount'

enum AffiliateHistoryStatusParams {
  all,
  withDraw,
  notWithDraw,
  applying,
}

const Reward = () => {
  const { i18n } = useLingui()

  const limit = 20
  const pageNeighbours = 1
  // 1是第一页
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<AffiliateHistoryStatusParams>(AffiliateHistoryStatusParams.all)

  const statusParams = useMemo(() => {
    switch (status) {
      case AffiliateHistoryStatusParams.all:
        return ''
      case AffiliateHistoryStatusParams.withDraw:
        return `${AffiliateHistoryStatus.SUCCESS}`
      case AffiliateHistoryStatusParams.notWithDraw:
        return `${AffiliateHistoryStatus.INIT}`
      case AffiliateHistoryStatusParams.applying:
        return `${AffiliateHistoryStatus.APPLY}, ${AffiliateHistoryStatus.PENDING}`
      default:
        return ''
    }
  }, [status])
  const account = useAccount()
  const { data, error } = useAffiliateHistory(page, limit, account, statusParams)
  const { mutate } = useSWRConfig()
  const swrKey = affiliateHistory(page, limit, statusParams, account)
  // console.log('data, error', data, error)

  const list = useMemo(() => {
    return data?.data
  }, [data])
  const count = useMemo(() => {
    return data?.count
  }, [data])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])

  const changeStatus = useCallback((value: AffiliateHistoryStatusParams) => {
    setStatus(value)
    setPage(1)
  }, [])

  const getStatusName = (status: AffiliateHistoryStatus) => {
    switch (status) {
      case AffiliateHistoryStatus.INIT:
        return i18n._(t`Not Withdrawn`)
      case AffiliateHistoryStatus.APPLY:
        return i18n._(t`Applying`)
      case AffiliateHistoryStatus.PENDING:
        return i18n._(t`Withdrawn Pending`)
      case AffiliateHistoryStatus.SUCCESS:
        return i18n._(t`Withdrawn Success`)
    }
    return 'Unknown'
  }

  return (
    <>
      <div className="flex flex-col gap-4 mt-8 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col">
          <Typography variant="h2" weight={700}>
            {i18n._(t`Reward`)}
          </Typography>
          <div className="flex flex-row items-center gap-2 mt-2">
            <InformationCircleIcon className="w-5 h-5 text-opacity-50 text-primary"></InformationCircleIcon>
            <Typography variant="sm" weight={700} className="text-opacity-50 text-primary">
              {i18n._(t`The cashback you receive depends on the tokens used by the users you invite`)}
            </Typography>
          </div>
        </div>
        <WithdrawAmount
          callback={() => {
            mutate(swrKey)
          }}
        />
      </div>
      <div className="w-full mt-8 overflow-x-auto border shadow-xl card bg-base-100">
        <div className="card-body">
          <div className="w-full">
            <div className="flex flex-row flex-wrap gap-2">
              <button
                className={classNames(
                  'btn btn-primary btn-sm',
                  status === AffiliateHistoryStatusParams.all ? 'btn-active' : 'btn-outline'
                )}
                onClick={() => changeStatus(AffiliateHistoryStatusParams.all)}
              >
                {i18n._(t`All`)}
              </button>
              <button
                className={classNames(
                  'btn btn-primary btn-sm',
                  status === AffiliateHistoryStatusParams.withDraw ? 'btn-active' : 'btn-outline'
                )}
                onClick={() => changeStatus(AffiliateHistoryStatusParams.withDraw)}
              >
                {i18n._(t`Withdrawn`)}
              </button>
              <button
                className={classNames(
                  'btn btn-primary btn-sm',
                  status === AffiliateHistoryStatusParams.notWithDraw ? 'btn-active' : 'btn-outline'
                )}
                onClick={() => changeStatus(AffiliateHistoryStatusParams.notWithDraw)}
              >
                {i18n._(t`Not Withdrawn`)}
              </button>
              <button
                className={classNames(
                  'btn btn-primary btn-sm',
                  status === AffiliateHistoryStatusParams.applying ? 'btn-active' : 'btn-outline'
                )}
                onClick={() => changeStatus(AffiliateHistoryStatusParams.applying)}
              >
                {i18n._(t`Applying`)}
              </button>
            </div>
            <div className="w-full mt-4">
              {list ? (
                <>
                  {list.length > 0 ? (
                    <>
                      <div className="w-full overflow-x-auto">
                        <table className="table w-full">
                          <thead className="border-b">
                            <tr>
                              <th className="bg-base-100">{i18n._(t`ID`)}</th>
                              <th className="bg-base-100">{i18n._(t`Date`)}</th>
                              <th className="bg-base-100">{i18n._(t`Status`)}</th>
                              <th className="bg-base-100">{i18n._(t`Reward (ETH)`)}</th>
                              <th className="bg-base-100">{i18n._(t`Reward (USDT)`)}</th>
                              <th className="bg-base-100">{i18n._(t`Reward (Token)`)}</th>
                              <th className="bg-base-100">{i18n._(t`Transaction`)}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {list.map((item) => {
                              return <RewardCard key={item.id} item={item} />
                            })}
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
                <>
                  <NoData></NoData>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Reward
