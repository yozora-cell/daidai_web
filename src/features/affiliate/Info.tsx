import { ChevronRightIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useAddPopup } from 'app/state/application/hooks'
import { Affiliate } from 'app/types/daidai'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

const Info = ({
  user,
  updateUpRefererId,
  code,
}: {
  user?: Affiliate
  updateUpRefererId: (code: string) => Promise<void>
  code?: string
}) => {
  const addPopup = useAddPopup()
  const { i18n } = useLingui()
  const router = useRouter()
  const [reward, setReward] = useState(0)
  const [rewardTokenSymbol, setRewardTokenSymbol] = useState('ETH')
  const [isLoading, setIsLoading] = useState(false)
  // 邀请码
  const [showCode, setShowCode] = useState(code ?? '')
  const [hasCode, setHasCode] = useState(false)
  const [isInit, setIsInit] = useState(true)

  const handleChange = useCallback(
    (e: any) => {
      setShowCode(e.target.value)
    },
    [setShowCode]
  )

  const handleConfirm = useCallback(() => {
    setIsLoading(true)
    updateUpRefererId(showCode).catch((err) => {
      console.error(err)
      addPopup({
        alert: {
          success: false,
          message: err.message,
        },
      })
    })
    setIsLoading(false)
  }, [updateUpRefererId, showCode, addPopup])

  useEffect(() => {
    if (user) {
      // 这里写死了BNB，后面要改的
      //   const balance = getFullDisplayBalance(new BigNumber(user.totalReward), 18, 4)
      // const balance = BigNumber.from(user.totalReward).div(e10(18)).toFixed(4)
      setReward(user.totalRewardETH)
      if (user.upRefererId) {
        setShowCode(user.upRefererId)
        setHasCode(true)
      } else {
        setShowCode(code ?? '')
        setHasCode(false)
      }
    }
  }, [code, user])

  // 有code的话就自动confirm
  useEffect(() => {
    if (isInit && showCode) {
      setIsInit(false)
      handleConfirm()
    }
  }, [isInit, showCode, handleConfirm])

  return (
    <>
      <div className="w-full mt-8 border shadow-lg card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">{i18n._(t`Total Reward`)}</h2>
          <div className="justify-end w-full card-actions">
            <button
              className="w-full gap-2 px-2 btn btn-primary btn-outline sm:px-0"
              onClick={() => {
                router.push('/affiliate/reward')
              }}
            >
              {reward} {rewardTokenSymbol}
              <ChevronRightIcon className="w-5"></ChevronRightIcon>
            </button>
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-title">{i18n._(t`Invited by`)}</h2>
          <div className="w-full">
            {hasCode ? (
              <>
                <div className="flex flex-row items-center justify-center">
                  <Typography variant="base" weight={700}>
                    {showCode}
                  </Typography>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                  <input
                    type="text"
                    className="grow input input-bordered"
                    value={showCode}
                    onChange={handleChange}
                    placeholder={i18n._(t`Please input the code`)}
                  />
                  <button
                    className={classNames('btn btn-primary flex-none w-52', isLoading ? 'loading' : '')}
                    onClick={handleConfirm}
                  >
                    {i18n._(t`Confirm`)}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Info
