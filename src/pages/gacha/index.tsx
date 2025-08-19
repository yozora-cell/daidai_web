import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'app/enums/Feature'
import About from 'app/features/gacha/About'
// import Machine from 'app/features/gacha/Machine'
import Machine from 'app/features/gacha/activity/Yamasaki'
import NFTPool from 'app/features/gacha/NFTPool'
import TokenPool from 'app/features/gacha/TokenPool'
import NetworkGuard from 'app/guards/Network'
import { SlotsNFT, SlotsToken } from 'app/types/daidai'
import { NextSeo } from 'next-seo'
import { useState } from 'react'

const Page = () => {
  const { i18n } = useLingui()
  const [nfts, setNfts] = useState<SlotsNFT[]>([])
  const [tokens, setTokens] = useState<SlotsToken[]>([])
  return (
    <>
      <NextSeo title={`${i18n._(t`Gacha`)}`} />
      <Machine
        loadData={(nfts, tokens) => {
          setNfts(nfts)
          setTokens(tokens)
        }}
      ></Machine>
      <div className="container px-6">
        <About></About>
        <NFTPool list={nfts}></NFTPool>
        <TokenPool list={tokens}></TokenPool>
      </div>
    </>
  )
}
Page.Guard = NetworkGuard(Feature.GACHA, false)
export default Page
