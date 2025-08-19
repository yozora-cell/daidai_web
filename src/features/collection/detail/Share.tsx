import { Popover, Transition } from '@headlessui/react'
import { ShareIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { Fragment, useState } from 'react'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'

const Share = ({
  className,
  classNameButton,
  title,
  direction = 'left',
  isRound = false,
}: {
  className: string
  classNameButton: string
  title: string
  direction?: 'left' | 'right'
  isRound?: boolean
}) => {
  const { i18n } = useLingui()
  const [shareUrl, setShareUrl] = useState(window.location.href)
  return (
    <>
      <Popover className={classNames(classNameButton, 'relative')}>
        {({ open }) => (
          <>
            <Popover.Button className={classNames(classNameButton)}>
              <div className="tooltip" data-tip={i18n._(t`Share`)}>
                {isRound ? (
                  <>
                    <div className="p-4 transition rounded-full cursor-pointer hover:shadow-lg">
                      <ShareIcon className={classNames(className, 'cursor-pointer')} />
                    </div>
                  </>
                ) : (
                  <>
                    <ShareIcon className={classNames(className, 'cursor-pointer')} />
                  </>
                )}
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={classNames('absolute z-10 px-4 mt-3 w-72', direction == 'right' ? 'left-0' : 'right-0')}
              >
                <div className="flex flex-col gap-4 overflow-hidden rounded-lg shadow-lg ring-1 ring-opacity-5 ring-primary bg-base-100">
                  <div className="relative">
                    <FacebookShareButton
                      url={shareUrl}
                      quote={title}
                      className="flex flex-row items-center justify-start w-full gap-4 !p-4 hover:shadow"
                    >
                      <FacebookIcon size={32} round />
                      <Typography className="font-bold hover:text-info">{i18n._(t`Share to Facebook`)}</Typography>
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={shareUrl}
                      title={title}
                      className="flex flex-row items-center justify-start w-full gap-4 !p-4 hover:shadow"
                    >
                      <TwitterIcon size={32} round />
                      <Typography className="font-bold hover:text-info">{i18n._(t`Share to Twitter`)}</Typography>
                    </TwitterShareButton>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  )
}
export default Share
