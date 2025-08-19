import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import TopSellerItem from 'app/features/home/TopSellerItem'
// import Button from 'app/components/Button'
// import Image from 'next/image'
import React from 'react'

const TopSeller = () => {
  const { i18n } = useLingui()
  return (
    <div className="container mt-32">
      <div className="flex flex-row items-center justify-start w-full px-6">
        <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Top`)}</h1>
        <div className="dropdown">
          <label
            tabIndex={0}
            className="flex flex-row items-end ml-3 text-2xl font-bold cursor-pointer sm:text-3xl text-info hover:text-info-focus"
          >
            sellers
            <ChevronDownIcon className="ml-2 -mr-1 w-7 h-7 text-info hover:text-info-focus" />
          </label>
          <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
            <li className="w-full">
              <div className="w-full indicator">
                <span className="flex flex-row items-center justify-center indicator-item indicator-middle right-4">
                  <CheckIcon className="w-4 h-4 text-info" />
                </span>
                <a className="text-sm font-bold text-info">{i18n._(t`sellers`)}</a>
              </div>
            </li>
            <li className="w-full">
              <a className="text-sm font-bold">{i18n._(t`buyers`)}</a>
            </li>
          </ul>
        </div>
        <h1 className="ml-3 text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`in`)}</h1>
        <div className="dropdown">
          <label
            tabIndex={1}
            className="flex flex-row items-end ml-3 text-2xl font-bold cursor-pointer sm:text-3xl text-info hover:text-info-focus"
          >
            1 day
            <ChevronDownIcon className="ml-2 -mr-1 w-7 h-7 text-info hover:text-info-focus" />
          </label>
          <ul tabIndex={1} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
            <li className="w-full">
              <div className="w-full indicator">
                <span className="flex flex-row items-center justify-center indicator-item indicator-middle right-4">
                  <CheckIcon className="w-4 h-4 text-info" />
                </span>
                <a className="text-sm font-bold text-info">{i18n._(t`1 day`)}</a>
              </div>
            </li>
            <li className="w-full">
              <a className="text-sm font-bold">{i18n._(t`7 days`)}</a>
            </li>
            <li className="w-full">
              <a className="text-sm font-bold">{i18n._(t`30 days`)}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-6 mt-10">{/* <TopSellerItem></TopSellerItem> */}</div>
    </div>
  )
}

export default TopSeller
