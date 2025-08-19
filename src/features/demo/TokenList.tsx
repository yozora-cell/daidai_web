import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { getTokenAddress, useTokenList } from 'app/state/token/hooks'
export interface TokenListProp {
  className?: string
  tabIndex: number
}
const TokenList = ({ className, tabIndex }: TokenListProp) => {
  const { chainId } = useActiveWeb3React()
  const inos = useTokenList()

  if (inos.length === 0) return <></>
  console.log('inos', inos)
  return (
    <ul className={classNames(className, '')} tabIndex={tabIndex}>
      {inos.map((item) => {
        return (
          <li
            key={getTokenAddress(item)}
            className="flex flex-row items-center justify-between cursor-pointer hover:bg-base-300"
          >
            <div>
              <CurrencyLogo currency={item}></CurrencyLogo>
            </div>
            <div className="flex flex-col items-end">
              <Typography variant="sm" weight={700} className="text-base-content">
                {item.symbol}
              </Typography>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default TokenList
