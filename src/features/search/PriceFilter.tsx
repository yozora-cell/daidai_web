import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useTokenList } from 'app/state/token/hooks'
import { useEffect, useMemo, useState } from 'react'

const PriceFilter = ({
  defaultMin,
  defaultMax,
  defaultToken,
  singal,
  onChangePrice,
}: {
  defaultMin: string
  defaultMax: string
  defaultToken: string
  singal: number
  onChangePrice: (min: string, max: string, token: string) => void
}) => {
  // console.log('singal', defaultMin, defaultMax, defaultToken, singal)
  const { i18n } = useLingui()
  const tokenList = useTokenList()
  const [min, setMin] = useState<string>(defaultMin)
  const [max, setMax] = useState<string>(defaultMax)
  const [token, setToken] = useState<string>(defaultToken)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reg = /^[0-9]+.?[0-9]*$/

  const minError = useMemo(() => {
    if (min !== '') {
      if (!reg.test(min)) {
        return true
      }
      if (Number(min) < 0) {
        return true
      }
      if (max !== '' && reg.test(max)) {
        if (Number(min) >= Number(max)) {
          return true
        }
      }
    }
    return false
  }, [max, min, reg])

  const maxError = useMemo(() => {
    if (max !== '') {
      if (!reg.test(max)) {
        return true
      }
      if (Number(max) < 0) {
        return true
      }
      if (min !== '' && reg.test(min)) {
        if (Number(max) <= Number(min)) {
          return true
        }
      }
    }
    return false
  }, [max, min, reg])

  const tokenError = useMemo(() => {
    if ((min !== '' || max !== '') && token === '') {
      return true
    }
    return false
  }, [max, min, token])

  const apply = () => {
    onChangePrice(min, max, token)
  }

  const clear = () => {
    setMin('')
    setMax('')
    setToken('')
  }

  useEffect(()=>{
    // 收到信号的变化之后就进行数值的清空
    console.log('singal', singal)
    clear()
  }, [singal])

  return (
    <>
      <div className="w-full border-b">
        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="text-base font-bold collapse-title">{i18n._(t`Price`)}</div>
          <div className="collapse-content">
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
                <select
                  className={classNames(
                    'select select-bordered !outline-none w-full sm:w-28',
                    tokenError ? 'select-error' : ''
                  )}
                  defaultValue={token}
                  onChange={(event) => {
                    setToken(event.target.value)
                  }}
                  value={token}
                >
                  {tokenList && tokenList.length > 0 && (
                    <>
                      <option value={''}></option>
                      {tokenList.map((token) => (
                        <>
                          <option value={token.symbol}>{token.symbol}</option>
                        </>
                      ))}
                    </>
                  )}
                </select>
                <div className="flex flex-row items-center justify-between flex-grow gap-2 sm:justify-start">
                  <input
                    className={classNames('w-16 input input-bordered !outline-none', minError ? 'input-error' : '')}
                    defaultValue={min}
                    onChange={(event) => {
                      setMin(event.target.value)
                    }}
                    value={min}
                  />
                  <Typography className="text-base" weight={700}>
                    {i18n._(t`to`)}
                  </Typography>
                  <input
                    className={classNames('w-16 input input-bordered !outline-none', maxError ? 'input-error' : '')}
                    defaultValue={max}
                    onChange={(event) => {
                      setMax(event.target.value)
                    }}
                    value={max}
                  />
                </div>
              </div>
              {tokenError || minError || maxError ? (
                <>
                  <button className="w-full btn btn-primary btn-outline disabled" disabled>
                    {i18n._(t`Apply`)}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full btn btn-primary btn-outline"
                    onClick={() => {
                      apply()
                    }}
                  >
                    {i18n._(t`Apply`)}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PriceFilter
