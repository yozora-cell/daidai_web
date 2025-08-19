import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Image from 'next/image'

const Charter = () => {
  const { i18n } = useLingui()
  return (
    <div className="container w-full mt-32 overflow-x-hidden">
      <div className="flex flex-row justify-start w-full px-6">
        <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Features`)}</h1>
      </div>
      <div className="flex flex-wrap px-6 mt-4 -mx-4">
        <div className="p-4 mb-6 md:w-1/3 sm:mb-0">
          <div>
            <Image
              src="/images/daidai/char_1.png"
              alt="char 1"
              layout="intrinsic"
              width={1203}
              height={503}
              className="rounded-lg"
            />
          </div>
          <h2 className="mt-5 text-xl font-bold text-base-content title-font min-h-[56px]">
            {i18n._(t`Compliance DAI/JPY Exchange`)}
          </h2>
          <Typography className="mt-2 text-base leading-relaxed">
            <a href="https://www.coinbest.com/" target="_blank" rel="noreferrer" className="underline">
              {i18n._(t`1. Exchange tokens through Coinbest DAI/JPY`)}
            </a>
          </Typography>
          <Typography className="text-base leading-relaxed">{i18n._(t`2. Support Ethereum, BSC, Polygon`)}</Typography>
        </div>
        <div className="p-4 mb-6 md:w-1/3 sm:mb-0">
          <div>
            <Image
              src="/images/daidai/char_2.png"
              alt="char 2"
              layout="intrinsic"
              width={1203}
              height={503}
              className="rounded-lg"
            />
          </div>
          <h2 className="mt-5 text-xl font-bold text-base-content title-font min-h-[56px]">
            {i18n._(t`Compile Traditional IPs into NFTs`)}
          </h2>
          <Typography className="mt-2 text-base leading-relaxed">
            {i18n._(t`Tokenise animation characters game items, idols, etc`)}
          </Typography>
        </div>
        <div className="p-4 mb-6 md:w-1/3 sm:mb-0">
          <div>
            <Image
              src="/images/daidai/char_3.png"
              alt="char 3"
              layout="intrinsic"
              width={1203}
              height={503}
              className="rounded-lg"
            />
          </div>
          <h2 className="mt-5 text-xl font-bold text-base-content title-font min-h-[56px]">
            {i18n._(t`Into Metaverse`)}
          </h2>
          <Typography className="mt-2 text-base leading-relaxed">
            {i18n._(t`1. Providing metaverse gateway for all clients`)}
          </Typography>
          <Typography className="text-base leading-relaxed">
            {i18n._(t`2. Build market place in metaverse for NFT trading`)}
          </Typography>
        </div>
      </div>
    </div>
  )
}
export default Charter
