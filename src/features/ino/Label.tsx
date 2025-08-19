import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { INOStage } from 'app/types/daidai'

const Label = ({ stage, isBadge }: { stage: INOStage; isBadge: boolean }) => {
  const { i18n } = useLingui()
  return (
    <>
      <div className="flex flex-row justify-start w-full">
        <div
          className={classNames(
            'text-base-100',
            isBadge ? 'border-0 badge badge-sm' : 'flex flex-row px-4 py-1 rounded-lg',
            stage == INOStage.PRE_SALE_COMING_SOON || stage == INOStage.PUBLIC_COMING_SOON ? 'bg-[#BABABA]' : '',
            stage == INOStage.ON_PRE_SALE ? 'bg-[#FFB800]' : '',
            stage == INOStage.ON_SELLING ? 'bg-[#24821B]' : ''
          )}
        >
          {isBadge ? (
            <>
              {stage == INOStage.LOADING && <>{i18n._(t`LOADING`)}</>}
              {stage == INOStage.ON_PRE_SALE && <>{i18n._(t`ON PRE-SALE`)}</>}
              {stage == INOStage.ON_SELLING && <>{i18n._(t`ON SELLING`)}</>}
              {stage == INOStage.PRE_SALE_COMING_SOON && <>{i18n._(t`PRE-SALE COMING SOON`)}</>}
              {stage == INOStage.PUBLIC_COMING_SOON && <>{i18n._(t`PUBLIC COMING SOON`)}</>}
            </>
          ) : (
            <>
              <Typography variant="sm" weight={700}>
                {stage == INOStage.LOADING && <>{i18n._(t`LOADING`)}</>}
                {stage == INOStage.ON_PRE_SALE && <>{i18n._(t`ON PRE-SALE`)}</>}
                {stage == INOStage.ON_SELLING && <>{i18n._(t`ON SELLING`)}</>}
                {stage == INOStage.PRE_SALE_COMING_SOON && <>{i18n._(t`PRE-SALE COMING SOON`)}</>}
                {stage == INOStage.PUBLIC_COMING_SOON && <>{i18n._(t`PUBLIC COMING SOON`)}</>}
              </Typography>
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default Label
