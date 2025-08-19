import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'

export default function AlertPopup({ title, message, success }: { title?: string; message: string; success: boolean }) {
  const { chainId } = useActiveWeb3React()
  return title ? (
    <>
      <div className="flex flex-col w-full flex-nowrap z-[1000]">
        <div className="flex flex-row items-center gap-2 pr-4">
          {success ? <CheckCircle className="w-5 text-info" /> : <AlertCircle className="w-5 text-error" />}
          <Typography className={classNames(success ? 'text-success' : 'text-error')}>{title}</Typography>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <Typography weight={700}>{message}</Typography>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-row w-full flex-nowrap z-[1000] gap-4 flex-1">
        <div className="flex flex-row">
          {success ? <CheckCircle className="w-5 text-info" /> : <AlertCircle className="w-5 text-error" />}
        </div>
        <div className="flex flex-col max-w-[263px]">
          <Typography weight={700} className="">
            {message}
          </Typography>
        </div>
      </div>
    </>
  )
}
