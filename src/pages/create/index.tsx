// import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import PleaseSignIn from 'app/components/PleaseSignIn'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums/Feature'
import NetworkGuard from 'app/guards/Network'
import { useActiveWeb3React } from 'app/services/web3'
// import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'

const Create = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  return (
    <>
      <NextSeo title={`${i18n._(t`Create`)}`} />
      {account ? (
        <div className="container px-6">
          <div className="mt-8">
            <Typography variant="h2" weight={700}>
              {i18n._(t`Create`)}
            </Typography>
          </div>
          <div className="flex flex-row w-full mt-4">
            <div className="w-full pr-0 sm:w-8/12 sm:pr-8">
              <div>
                <Typography variant="base" weight={700}>
                  {i18n._(t`Upload file`)}
                </Typography>
                <div className="flex flex-col items-center justify-center w-full mt-4 border-2 border-dotted rounded border-base-300 h-36">
                  <Typography variant="sm" className="text-base-content text-opacity-60">
                    {i18n._(t`PNG, GIF, WEBP, MP4 or MP3. Max 100mb.`)}
                  </Typography>
                  <div className="relative flex flex-col items-center justify-center w-40 h-10 mt-2 shadow bg-primary rounded-2xl text-base-100">
                    <Typography variant="base" weight={700}>
                      {i18n._(t`Choose file`)}
                    </Typography>
                    <input className="absolute w-full h-full opacity-0 cursor-pointer" type="file" />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Typography variant="base" weight={700}>
                  {i18n._(t`Name`)}
                </Typography>
                <input
                  type="text"
                  placeholder={`${i18n._(t`Item name`)}`}
                  className="w-full mt-4 input input-bordered"
                ></input>
              </div>
              <div className="mt-8">
                <Typography variant="base" weight={700}>
                  {i18n._(t`External link`)}
                </Typography>
                <Typography variant="sm" className="mt-1 text-base-content text-opacity-60">
                  {i18n._(
                    t`DAIDAI will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.`
                  )}
                </Typography>
                <input
                  type="text"
                  placeholder={`${i18n._(t`https://yoursite.io/item/123`)}`}
                  className="w-full mt-4 input input-bordered"
                ></input>
              </div>
              <div className="mt-8">
                <div className="flex flex-row items-end">
                  <Typography variant="base" weight={700}>
                    {i18n._(t`Description`)}
                  </Typography>
                  <Typography variant="sm" weight={700} className="ml-2 text-base-content text-opacity-60">
                    {i18n._(t`(Optional)`)}
                  </Typography>
                </div>
                <Typography variant="sm" className="mt-1 text-base-content text-opacity-60">
                  {i18n._(t`The description will be included on the item's detail page underneath its image. `)}
                </Typography>
                <textarea
                  className="w-full mt-4 textarea textarea-bordered"
                  placeholder={`${i18n._(t`Provide a detailed description of your item.`)}`}
                ></textarea>
              </div>
              <div className="mt-8"></div>
            </div>
            <div className="hidden w-4/12 sm:block">preview</div>
          </div>
        </div>
      ) : (
        <PleaseSignIn></PleaseSignIn>
      )}
    </>
  )
}
Create.Guard = NetworkGuard(Feature.CREATE)
export default Create
