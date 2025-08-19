import { ChevronUpIcon } from '@heroicons/react/solid'
import { useAppDispatch } from 'app/state/hooks'
import { updateTheme } from 'app/state/theme/action'
import { useIsDarkMode, useTheme } from 'app/state/theme/hooks'
import React, { Fragment } from 'react'

import Typography from '../Typography'

export default function ThemeSwitch() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  console.log('theme, isDarkMode', theme, isDarkMode)
  const dispatch = useAppDispatch()
  const updateThemeDispath = (curTheme: string) => {
    dispatch(updateTheme({ theme: curTheme }))
  }
  const themeList = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forset',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
  ]
  return (
    <>
      <div tabIndex={0} title="Change Theme" className="dropdown dropdown-top">
        <button tabIndex={0} className="px-4 py-2 text-sm font-medium rounded-md text-base-content bg-base-200">
          <div className="flex flex-row items-center justify-between">
            <Typography weight={700} variant="sm">
              {theme ? theme : 'Theme'}
            </Typography>
            <ChevronUpIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
          </div>
        </button>
        <div
          tabIndex={0}
          className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16"
        >
          <div className="grid grid-cols-1 gap-3 p-3">
            {themeList.map((item, i) => {
              return (
                <div
                  className="overflow-hidden rounded-lg outline-base-content outline-2 outline-offset-2"
                  data-set-theme={item}
                  data-act-className={'outline'}
                  key={i}
                  onClick={() => {
                    // console.log('click to change', item)
                    updateThemeDispath(item)
                  }}
                >
                  <div data-theme={item} className="w-full font-sans cursor-pointer bg-base-100 text-base-content">
                    <div className="grid grid-cols-5 grid-rows-3">
                      <div className="flex col-span-5 row-span-3 row-start-1 gap-1 px-4 py-3">
                        <div className="flex-grow text-sm font-bold">{item}</div>{' '}
                        <div className="flex flex-wrap flex-shrink-0 gap-1">
                          <div className="w-2 rounded bg-primary"></div>{' '}
                          <div className="w-2 rounded bg-secondary"></div> <div className="w-2 rounded bg-accent"></div>{' '}
                          <div className="w-2 rounded bg-neutral"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <a className="overflow-hidden rounded-lg outline-base-content" href="/theme-generator/">
              <div className="w-full font-sans cursor-pointer hover:bg-neutral hover:text-neutral-content">
                <div className="flex gap-2 p-3">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 512 512"
                  >
                    <path d="M96,208H48a16,16,0,0,1,0-32H96a16,16,0,0,1,0,32Z"></path>
                    <line x1="90.25" y1="90.25" x2="124.19" y2="124.19"></line>
                    <path d="M124.19,140.19a15.91,15.91,0,0,1-11.31-4.69L78.93,101.56a16,16,0,0,1,22.63-22.63l33.94,33.95a16,16,0,0,1-11.31,27.31Z"></path>
                    <path d="M192,112a16,16,0,0,1-16-16V48a16,16,0,0,1,32,0V96A16,16,0,0,1,192,112Z"></path>
                    <line x1="293.89" y1="90.25" x2="259.95" y2="124.19"></line>
                    <path d="M260,140.19a16,16,0,0,1-11.31-27.31l33.94-33.95a16,16,0,0,1,22.63,22.63L271.27,135.5A15.94,15.94,0,0,1,260,140.19Z"></path>
                    <line x1="124.19" y1="259.95" x2="90.25" y2="293.89"></line>
                    <path d="M90.25,309.89a16,16,0,0,1-11.32-27.31l33.95-33.94a16,16,0,0,1,22.62,22.63l-33.94,33.94A16,16,0,0,1,90.25,309.89Z"></path>
                    <path d="M219,151.83a26,26,0,0,0-36.77,0l-30.43,30.43a26,26,0,0,0,0,36.77L208.76,276a4,4,0,0,0,5.66,0L276,214.42a4,4,0,0,0,0-5.66Z"></path>
                    <path d="M472.31,405.11,304.24,237a4,4,0,0,0-5.66,0L237,298.58a4,4,0,0,0,0,5.66L405.12,472.31a26,26,0,0,0,36.76,0l30.43-30.43h0A26,26,0,0,0,472.31,405.11Z"></path>
                  </svg>{' '}
                  <div className="flex-grow text-sm font-bold">Make your theme!</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
