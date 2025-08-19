import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames } from 'app/functions/styling'
// @ts-ignore TYPE NEEDS FIXING
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

import Typography from '../Typography'

const LANG_TO_COUNTRY: Record<string, string> = {
  en: 'English',
  // de: 'Deutsch',
  // fr: 'Français',
  // it: 'Italiano',
  // ro: 'Română',
  // ru: 'Русский',
  // vi: 'Tiếng Việt',
  zh_CN: '简体中文',
  zh_TW: '繁體中文',
  // ko: '한국어',
  ja: '日本語',
  // fa: 'فارسی',
  // pt_BR: 'Português',
  // hi: 'हिन्दी',
  // es: 'Español',
  // tr: 'Türkçe',
  // el: 'ελληνικά',
  // pl: 'Polskie',
}

export default function LangSwitcher({
  isGhost = false,
  isLeftNav = false,
}: {
  isGhost?: boolean
  isLeftNav?: boolean
}) {
  const { locale, locales, asPath, push } = useRouter()

  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <Menu.Button
          className={classNames(
            isLeftNav ? 'px-2 w-fit' : 'px-4 w-full',
            'py-2 text-sm font-medium rounded-lg text-base-content',
            isGhost ? '' : 'bg-base-200'
          )}
        >
          <div className="flex flex-row items-center justify-between">
            <Typography weight={700} variant="sm">
              {locale && LANG_TO_COUNTRY[locale]}
            </Typography>
            <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className={classNames(
            'absolute  mt-2 origin-top-right divide-y rounded-md shadow-lg divide-base-200 bg-base-100 ring-1 ring-black ring-opacity-5 focus:outline-none',
            isLeftNav ? 'w-40 left-0' : 'w-56 right-0'
          )}
        >
          {locales?.map((l, index) => {
            return (
              <Menu.Item key={index}>
                {({ active }) => {
                  return (
                    <Typography
                      variant="sm"
                      weight={700}
                      onClick={() => {
                        cookieCutter.set('NEXT_LOCALE', l)
                        push(asPath, undefined, { locale: l })
                      }}
                      className={classNames('px-4 py-2 cursor-pointer text-base-content', active ? 'bg-base-200' : '')}
                    >
                      {LANG_TO_COUNTRY[l]}
                    </Typography>
                  )
                }}
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
