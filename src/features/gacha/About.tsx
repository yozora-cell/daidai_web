import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Image from 'app/features/common/Image'

const Page = () => {
  const { i18n } = useLingui()
  const icon = '/images/gacha/icon.png'
  return (
    <>
      <div className="flex flex-row items-center justify-start w-full gap-2 pb-2 border-b border-gray-700 border-dotted mt-28">
        <div className="relative w-[54px] h-[45px]">
          <Image src={icon} alt="img" layout="fill" className="object-cover" />
        </div>
        <Typography className="text-2xl md:text-5xl">{i18n._(t`ABOUT DAIDAI GACHA`)}</Typography>
      </div>
      <div className="w-full mt-4">
        <Typography className="text-1xl md:text-2xl">{i18n._(t`60% of the Prize Pot will be used buy rarible NFT in DAIDAI. `)}</Typography>
        <Typography className="mt-2 text-1xl md:text-2xl">{i18n._(t`And the 35% of Prize Pot will be Used as Token reward.`)}</Typography>
      </div>
    </>
  )
}

export default Page
