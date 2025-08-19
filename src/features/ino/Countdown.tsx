import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import Countdown from 'react-countdown'
import { INOStage } from 'types/daidai'

interface MyCountDownProp {
  startTimestamp?: number
  stage: INOStage
  onEnd: () => void
}
const MyCountDown = ({ startTimestamp, stage, onEnd }: MyCountDownProp) => {
  const { i18n } = useLingui()
  // 倒计时相关
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }) => {
    // console.log('renderer hours minutes seconds completed', hours, minutes, seconds, completed)
    if (completed) {
      console.log('Mycountdown completed', completed)
      // Render a completed state
      onEnd()
      return <div></div>
    } else {
      // Render a countdown
      return (
        <div className="grid grid-flow-col gap-5 mt-2 text-center auto-cols-max">
          <div className="flex flex-col">
            <span className="font-mono text-3xl countdown">
              <span
                className={classNames('my-countdownspan', days > 99 ? 'my-countdownspan--static' : '')}
                style={{
                  ['--value' as any]: days,
                }}
              >
                {days}
              </span>
            </span>
            {i18n._(t`days`)}
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl countdown">
              <span
                className="my-countdownspan"
                style={{
                  ['--value' as any]: hours,
                }}
              ></span>
            </span>
            {i18n._(t`hours`)}
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl countdown">
              <span
                className="my-countdownspan"
                style={{
                  ['--value' as any]: minutes,
                }}
              ></span>
            </span>
            {i18n._(t`min`)}
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl countdown">
              <span
                className="my-countdownspan"
                style={{
                  ['--value' as any]: seconds,
                }}
              ></span>
            </span>
            {i18n._(t`sec`)}
          </div>
        </div>
      )
    }
  }
  return (
    <>
      {stage != INOStage.ON_SELLING && stage != INOStage.LOADING && (
        <>
          <div className="flex flex-row justify-center w-full">
            <div className="flex flex-col items-center px-6 py-2 bg-base-100 rounded-2xl bg-opacity-20 backdrop-blur-[20px]">
              <Typography variant="sm">
                {stage == INOStage.PUBLIC_COMING_SOON && <>{i18n._(t`Officially Public is Coming`)}</>}
                {stage == INOStage.ON_PRE_SALE && <>{i18n._(t`Officially Public is Coming`)}</>}
                {stage == INOStage.PRE_SALE_COMING_SOON && <>{i18n._(t`PRE-Sale is Coming`)}</>}
              </Typography>
              <Countdown
                date={startTimestamp}
                renderer={renderer}
                autoStart={true}
                intervalDelay={1000}
                key={startTimestamp}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default MyCountDown
