import { ExclamationIcon, XCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useState } from 'react'
const TestNetworkWarning = () => {
  const { i18n } = useLingui()
  const [isShow, setIsShow] = useState(true)
  return (
    <>
      {isShow ? (
        <>
          <div className="w-full p-4 fixed left-0 right-0 top-[64px] z-10">
            <div className="shadow-lg alert alert-warning">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row items-center gap-4">
                  <div className="w-6 h-6">
                    <ExclamationIcon className="w-6 h-6"></ExclamationIcon>
                  </div>
                  <span>
                    {i18n._(
                      t`You're viewing data from the test network, but your wallet is connected to the main network (BSC). To use DAIDAI, please switch to `
                    )}
                    <a href={'https://daidai.io'} className="ml-2 underline">
                      daidai.io
                    </a>
                  </span>
                </div>
                <div>
                  <XCircleIcon
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      setIsShow(false)
                    }}
                  ></XCircleIcon>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default TestNetworkWarning
