import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import Image from 'app/features/common/Image'
import { getTokenAddress } from 'app/state/token/hooks'
import { SlotsToken } from 'app/types/daidai'
import { useMemo } from 'react'

interface SlotsTokenCount {
  token: SlotsToken
  count: number
}

const Page = ({ list }: { list: SlotsToken[] }) => {
  const { i18n } = useLingui()
  const icon = '/images/gacha/icon.png'
  const tokenList = useMemo(() => {
    const set = new Set<string>()
    const res: SlotsToken[] = []
    list.forEach((item) => {
      if (set.has(getTokenAddress(item.token)) === false) {
        res.push(item)
        set.add(getTokenAddress(item.token))
      }
    })
    return res
  }, [list])

  const tokenCountList = useMemo(() => {
    const map = new Map<string, number>()
    const res: SlotsTokenCount[] = []
    list.forEach((item) => {
      const key = getTokenAddress(item.token) + ':' + item.price.toSignificant(6)
      if (map.has(key) === false) {
        res.push({
          token: item,
          count: 1,
        })
        map.set(key, res.length - 1)
      } else {
        const index = map.get(key)
        if (index !== undefined) {
          res[index] = {
            token: item,
            count: res[index].count + 1,
          }
        }
      }
    })
    return res
  }, [list])

  return (
    <>
      <div className="flex flex-row items-center justify-start w-full gap-2 pb-2 border-b border-gray-700 border-dotted mt-28">
        <div className="relative w-[32px] h-[36px]">
          <Image src={icon} alt="img" layout="fill" className="object-cover" />
        </div>
        <Typography className="text-2xl md:text-4xl">{i18n._(t`Token Slots`)}</Typography>
      </div>
      <div className="flex flex-row gap-4 mt-16">
        {tokenList.map((item) => (
          <div key={getTokenAddress(item.token)}>
            <CurrencyLogo currency={item.token} size={'70x'}></CurrencyLogo>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Typography className="text-1xl" weight={700}>
          {i18n._(t`The Token Slots ALLOCATION RATIO`)}
        </Typography>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="table w-full max-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="bg-base-100"></th>
              <th className="bg-base-100">{i18n._(t`Token`)}</th>
              <th className="bg-base-100">{i18n._(t`Rate`)}</th>
            </tr>
          </thead>
          <tbody>
            {tokenCountList.map((item, index) => (
              <>
                <tr>
                  <th>{index + 1}</th>
                  <td>
                    {item.token.price.toSignificant(6)}
                    {item.token.token.symbol}
                  </td>
                  <td>{Number((100 * item.count) / list.length).toFixed(2)}%</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Page
