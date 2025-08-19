import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
const NoData = () => {
  const { i18n } = useLingui()
  return (
    <div className="flex flex-col items-center justify-center w-full py-8 mx-auto">
      <Typography variant="base" className="py-2 text-center">
        {i18n._(t`Loading complete, no data!`)}
      </Typography>
    </div>
  )
}

export default NoData
