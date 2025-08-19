import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { getExplorerLink } from 'app/functions'
import { formatNumber } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenList } from 'app/state/token/hooks'
import { getTokenAddress } from 'app/state/token/hooks'
import { AffiliateHistory } from 'app/types/daidai'
import { AffiliateHistoryStatus } from 'app/types/daidai'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const RewardCard = ({ item }: { item: AffiliateHistory }) => {
  const { chainId, account } = useActiveWeb3React()
  const { i18n } = useLingui()
  // console.log('item AffiliateHistory', item)
  const time = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tokenList = useTokenList()
  const symbol = useMemo(() => {
    const result = tokenList.find((cur) => {
      if (getTokenAddress(cur).toLocaleLowerCase() == item.token?.toLocaleLowerCase()) {
        return cur.symbol
      }
    })
    if (result) {
      return result.symbol
    }
    return '???'
  }, [tokenList, item.token])

  const getStatusName = () => {
    switch (item.status) {
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

  // const rewardAmount = BigNumber.from(item.rewardAmount).div(e10(18)).toFixed(4)
  return (
    <tr>
      <th>
        <Typography variant="base">{item.id}</Typography>
      </th>
      <td>
        <Typography variant="base">{time}</Typography>
      </td>
      <td>
        <Typography variant="base">{getStatusName()}</Typography>
      </td>
      <td>
        <div className="tooltip" data-tip={item.rewardETH}>
          <Typography variant="base">{formatNumber(item.rewardETH)}</Typography>
        </div>
      </td>
      <td>
        <Typography variant="base">{item.rewardUSDT}</Typography>
      </td>
      <td>
        <Typography variant="base">
          {item.rewardAmount} {symbol}
        </Typography>
      </td>
      <td>
        {item.rewardFrom ? (
          <>
            <a target={'_blank'} href={getExplorerLink(chainId, item.rewardFrom, 'transaction')} rel="noreferrer">
              <ExternalLinkIcon className="w-4 cursor-pointer" />
            </a>
          </>
        ) : (
          <></>
        )}
      </td>
    </tr>
  )
}

export default RewardCard
