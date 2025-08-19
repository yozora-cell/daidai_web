import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { formatNumber, formatNumberScale } from 'app/functions'
import { BASE_INO_OR_COLLECTION } from 'app/types/daidai'

const Page = ({ data }: { data: BASE_INO_OR_COLLECTION }) => {
  const { i18n } = useLingui()
  return (
    <>
      <div className="flex flex-row w-full gap-4 mt-2 grid-4">
        <div className="text-right">
          <Typography variant="sm" weight={700}>
            {i18n._(t`Items`)}
          </Typography>
          <Typography variant="sm">{formatNumberScale(data.totalSupply)}</Typography>
        </div>
        <div className="text-right">
          <Typography variant="sm" weight={700}>
            {i18n._(t`Items listed`)}
          </Typography>
          <Typography variant="sm">{formatNumberScale(data.listed)}</Typography>
        </div>
        <div className="text-right">
          <Typography variant="sm" weight={700}>
            {i18n._(t`Floor Price`)}
          </Typography>
          <Typography variant="sm">{formatNumber(data.floorPrice)}ETH</Typography>
        </div>
        <div className="text-right">
          <Typography variant="sm" weight={700}>
            {i18n._(t`Total Volume`)}
          </Typography>
          <Typography variant="sm">{formatNumber(data.totalVolumeETH)}ETH</Typography>
        </div>
      </div>
    </>
  )
}
export default Page
