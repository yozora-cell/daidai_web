import { ChartBarIcon, GiftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Link from 'next/link'
import React from 'react'

const Event = () => {
  const { i18n } = useLingui()

  return (
    <>
      <div className="w-full mt-4">
        <div className="flex flex-row justify-between w-full">
          <div className="w-6/12 pr-2">
            <Link href={`/ranking/collection`}>
              <a className="w-full">
                <div className="flex flex-row items-center justify-between w-full h-10 px-4 border border-[#F2F2F5] rounded bg-[#F8F8F9] hover:bg-base-200">
                  <Typography className="!text-sm">{i18n._(t`Ranking`)}</Typography>
                  <ChartBarIcon className="w-4 text-info" />
                </div>
              </a>
            </Link>
          </div>
          <div className="w-6/12 pl-2">
            <Link href={`/affiliate`}>
              <a className="w-full">
                <div className="flex flex-row items-center justify-between w-full h-10 px-4 border border-[#F2F2F5] rounded bg-[#F8F8F9] hover:bg-base-200">
                  <Typography className="!text-sm">{i18n._(t`Affiliate`)}</Typography>
                  <GiftIcon className="w-4 text-error" />
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default Event
