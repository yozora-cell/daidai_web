import { Popover, Transition } from '@headlessui/react'
import { DotsHorizontalIcon, GlobeAltIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, MediumIcon, TwitterIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import { Collection } from 'app/types/daidai'
import { Fragment } from 'react'

const Socials = ({ data, isExtend }: { data: Collection; isExtend: boolean }) => {
  const { i18n } = useLingui()
  return (
    <>
      {data.socials ? (
        <>
          {isExtend ? (
            <>
              {data.socials.website && data.socials.website.url ? (
                <>
                  <a href={`${data.socials?.website.url}`} target="_blank" rel="noreferrer" className="h-[52px]">
                    <div className="tooltip" data-tip={i18n._(t`Website`)}>
                      <div className="p-4 transition rounded-full cursor-pointer hover:shadow-lg">
                        <GlobeAltIcon className="w-5 h-5 text-primary"></GlobeAltIcon>
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <></>
              )}
              {data.socials.discord && data.socials.discord.url ? (
                <>
                  <a href={`${data.socials?.discord.url}`} target="_blank" rel="noreferrer" className="h-[52px]">
                    <div className="tooltip" data-tip={i18n._(t`Discord`)}>
                      <div className="p-4 transition rounded-full cursor-pointer hover:shadow-lg">
                        <DiscordIcon className="w-5 h-5 text-primary"></DiscordIcon>
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <></>
              )}
              {data.socials.medium && data.socials.medium.url ? (
                <>
                  <a href={`${data.socials?.medium.url}`} target="_blank" rel="noreferrer" className="h-[52px]">
                    <div className="tooltip" data-tip={i18n._(t`Medium`)}>
                      <div className="p-4 transition rounded-full cursor-pointer hover:shadow-lg">
                        <MediumIcon className="w-5 h-5 text-primary"></MediumIcon>
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <></>
              )}
              {data.socials.twitter && data.socials.twitter.url ? (
                <>
                  <a href={`${data.socials?.twitter.url}`} target="_blank" rel="noreferrer" className="h-[52px]">
                    <div className="tooltip" data-tip={i18n._(t`Twitter`)}>
                      <div className="p-4 transition rounded-full cursor-pointer hover:shadow-lg">
                        <TwitterIcon className="w-5 h-5 text-primary"></TwitterIcon>
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button>
                      <div className="relative p-4 transition rounded-full cursor-pointer hover:shadow-lg">
                        <DotsHorizontalIcon className="w-5 h-5 text-primary"></DotsHorizontalIcon>
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
                      <Popover.Panel className="absolute right-0 z-10 mt-3 w-[220px]">
                        <div
                          className="overflow-hidden rounded-lg shadow-lg ring-1 ring-base-300 ring-opacity-5 bg-base-100"
                          style={{
                            boxShadow: 'rgb(0 0 0 / 16%) 0px 4px 16px',
                          }}
                        >
                          <div className="p-4">
                            <Typography weight={700}>{i18n._(t`LINKS`)}</Typography>
                          </div>
                          {data.socials?.website && data.socials.website.url ? (
                            <>
                              <a href={`${data.socials?.website.url}`} target="_blank" rel="noreferrer">
                                <div className="flex flex-row items-center gap-4 p-4 transition-shadow border-t cursor-pointer hover:shadow hover:text-info">
                                  <GlobeAltIcon className="w-5 h-5 text-primary"></GlobeAltIcon>
                                  <Typography weight={700}>{i18n._(t`Website`)}</Typography>
                                </div>
                              </a>
                            </>
                          ) : (
                            <></>
                          )}
                          {data.socials?.discord && data.socials.discord.url ? (
                            <>
                              <a href={`${data.socials?.discord.url}`} target="_blank" rel="noreferrer">
                                <div className="flex flex-row items-center gap-4 p-4 transition-shadow border-t cursor-pointer hover:shadow hover:text-info">
                                  <DiscordIcon className="w-5 h-5 text-primary"></DiscordIcon>
                                  <Typography weight={700}>{i18n._(t`Discord`)}</Typography>
                                </div>
                              </a>
                            </>
                          ) : (
                            <></>
                          )}
                          {data.socials?.medium && data.socials.medium.url ? (
                            <>
                              <a href={`${data.socials?.medium.url}`} target="_blank" rel="noreferrer">
                                <div className="flex flex-row items-center gap-4 p-4 transition-shadow border-t cursor-pointer hover:shadow hover:text-info">
                                  <MediumIcon className="w-5 h-5 text-primary"></MediumIcon>
                                  <Typography weight={700}>{i18n._(t`Medium`)}</Typography>
                                </div>
                              </a>
                            </>
                          ) : (
                            <></>
                          )}
                          {data.socials?.twitter && data.socials.twitter.url ? (
                            <>
                              <a href={`${data.socials?.twitter.url}`} target="_blank" rel="noreferrer">
                                <div className="flex flex-row items-center gap-4 p-4 transition-shadow border-t cursor-pointer hover:shadow hover:text-info">
                                  <TwitterIcon className="w-5 h-5 text-primary"></TwitterIcon>
                                  <Typography weight={700}>{i18n._(t`Twitter`)}</Typography>
                                </div>
                              </a>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default Socials
