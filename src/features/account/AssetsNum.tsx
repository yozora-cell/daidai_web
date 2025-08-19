import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { formatNumber, formatNumberScale } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAllTokenBalancesWithLoadingIndicatorV2, useCurrencyBalance } from 'app/state/wallet/hooks'
import { Account } from 'app/types/daidai'
import React, { FC, useMemo } from 'react'

const AssetsNum: FC<{ account: string; data: Account }> = ({ account, data }) => {
  const { i18n } = useLingui()
  const balances = useWalletBalances(account)

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 md:gap-12 md:grid-cols-4 w-fit mt-9">
        <div className="flex flex-col items-start gap-2">
          <Typography weight={700} className="text-xl">
            {formatNumberScale(balances.length)}
          </Typography>
          <Typography className="text-base text-primary/50">{i18n._(t`Assets`)}</Typography>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Typography weight={700} className="text-xl">
            {formatNumberScale(data.nftNumber)}
          </Typography>
          <Typography className="text-base text-primary/50">{i18n._(t`NFT Collected`)}</Typography>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Typography weight={700} className="text-xl">
            {formatNumber(data.totalVolumeETH)}
          </Typography>
          <Typography className="text-base text-primary/50">{i18n._(t`Volume(ETH)`)}</Typography>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Typography weight={700} className="text-xl">
            {formatNumberScale(data.totalTrades)}
          </Typography>
          <Typography className="text-base text-primary/50">{i18n._(t`Total Trades`)}</Typography>
        </div>
      </div>
    </div>
  )
}

const useWalletBalances = (account: string) => {
  const { chainId } = useActiveWeb3React()
  const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicatorV2()

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const balances = useMemo(() => {
    const res = Object.values(_balances).reduce<Assets[]>((acc, cur) => {
      if (cur.greaterThan(ZERO)) acc.push({ asset: cur })

      return acc
    }, [])

    if (ethBalance) {
      res.push({ asset: ethBalance })
    }
    return res
  }, [_balances, ethBalance])

  return balances
}

export default AssetsNum
