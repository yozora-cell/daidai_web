import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Image from 'next/image'

const Service = () => {
  const { i18n } = useLingui()
  return (
    <div className="container w-full mt-32 overflow-x-hidden">
      <div className="flex flex-row justify-start w-full px-6">
        <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Services`)}</h1>
      </div>
      <div className="flex flex-wrap px-6 mt-10 -mx-4">
        <div className="h-auto p-4 xl:w-1/4 md:w-1/2">
          <div className="p-6 rounded-lg shadow bg-base-100">
            <div className="w-full mb-6">
              <Image
                src="/images/daidai/service_1.png"
                alt="char 1"
                layout="intrinsic"
                width={720}
                height={400}
                className="rounded-lg"
              />
            </div>
            <h2 className="h-auto mb-4 text-lg font-bold text-base-content title-font">
              {i18n._(t`EIP-3589 Assemble assets into NFTs`)}
            </h2>
            <Typography variant="base" className="leading-relaxed">
              {i18n._(t`Using NFT assemble techology to back up NFTs with tokens(collateral rate 1%-15%)`)}
            </Typography>
          </div>
        </div>
        <div className="h-auto p-4 xl:w-1/4 md:w-1/2">
          <div className="p-6 rounded-lg shadow bg-base-100">
            <div className="w-full mb-6">
              <Image
                src="/images/daidai/service_2.png"
                alt="char 1"
                layout="intrinsic"
                width={720}
                height={400}
                className="rounded-lg"
              />
            </div>
            <h2 className="h-auto mb-4 text-lg font-bold text-base-content title-font">{i18n._(t`Membership`)}</h2>
            <Typography variant="base" className="leading-relaxed">
              {i18n._(t`1. Get Lottery ticket every month`)}
            </Typography>
            <Typography variant="base" className="leading-relaxed">
              {i18n._(t`2. Get NFT/Token airdrops`)}
            </Typography>
            <Typography variant="base" className="leading-relaxed">
              {i18n._(t`3. Platform tax return`)}
            </Typography>
          </div>
        </div>
        <div className="h-auto p-4 xl:w-1/4 md:w-1/2">
          <div className="p-6 rounded-lg shadow bg-base-100">
            <div className="w-full mb-6">
              <Image
                src="/images/daidai/service_3.png"
                alt="char 1"
                layout="intrinsic"
                width={720}
                height={400}
                className="rounded-lg"
              />
            </div>
            <h2 className="h-auto mb-4 text-lg font-bold text-base-content title-font">{i18n._(t`Custom Pricing`)}</h2>
            <Typography variant="base" className="leading-relaxed">
              {i18n._(t`INO NFTs can be mint by multiple tokens`)}
            </Typography>
          </div>
        </div>
        <div className="h-auto p-4 xl:w-1/4 md:w-1/2">
          <div className="p-6 rounded-lg shadow bg-base-100">
            <div className="w-full mb-6">
              <Image
                src="/images/daidai/service_4.png"
                alt="char 1"
                layout="intrinsic"
                width={720}
                height={400}
                className="rounded-lg"
              />
            </div>
            <h2 className="h-auto mb-4 text-lg font-bold text-base-content title-font">
              {i18n._(t`Multiple Chain Support`)}
            </h2>
            <Typography variant="base" className="leading-relaxed">
              {i18n._(t`NFTs and Tokens from Ethereum, BSC, Polygon chains can be imported and listed.`)}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Service
