import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, LogoIcon, MediumIcon, TelegramIcon, TwitterIcon } from 'app/components/Icon'
import LanguageSwitch from 'app/components/LanguageSwitch'
// import ThemeSwitch from 'app/components/ThemeSwitch'
import Typography from 'app/components/Typography'
import ShareUrl from 'app/config/share_url'
// import { Feature } from 'app/enums'
// import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
// import Image from 'next/image'
import React, { useMemo } from 'react'

import Container from '../Container'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { locale } = useRouter()
  // console.log('useRouter', locale)

  const getGitbook: any = useMemo(() => {
    const gitbookDataEn = {
      'Navigating DaiDai': 'https://docs.daidai.io/help-center/navigating-daidai',
      'How to make a purchase':
        'https://docs.daidai.io/help-center/once-youve-connected-a-wallet-how-do-you-make-a-purchase',
      'How to connect other wallets': 'https://docs.daidai.io/help-center/how-do-you-connect-other-wallets',
      'What is a wallet': 'https://docs.daidai.io/help-center/what-is-a-wallet',
      'About NFT Marketplace': 'https://docs.daidai.io/help-center/what-terms-do-i-need-to-know-before-getting-started',
      'About Blockchain':
        'https://docs.daidai.io/help-center/what-is-a-blockchain-and-how-does-it-work-why-blockchain-at-all',
      'What is EIP-3589': 'https://docs.daidai.io/help-center/what-is-eip-3589',
      Terms: 'https://docs.daidai.io/private-and-terms/terms-of-service',
      'Privacy Policy': 'https://docs.daidai.io/private-and-terms/privacy-policy',
    }

    const gitbookDataJp = gitbookDataEn

    const gitbookDataCn = {
      'Navigating DaiDai': 'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/guang-guang-daidai',
      'How to make a purchase':
        'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/yi-dan-ni-lian-jie-le-yi-ge-qian-bao-ni-ru-he-jin-hang-gou-mai',
      'How to connect other wallets':
        'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/ru-he-lian-jie-qi-ta-qian-bao',
      'What is a wallet': 'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/shen-me-shi-qian-bao',
      'About NFT Marketplace':
        'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/zai-kai-shi-zhi-qian-wo-xu-yao-zhi-dao-na-xie-shu-yu',
      'About Blockchain':
        'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/shen-me-shi-qu-kuai-lian-ta-shi-ru-he-gong-zuo-de-wei-shen-me-yao-xuan-ze-qu-kuai-lian-ji-shu',
      'What is EIP-3589': 'https://docs.daidai.io/v/jian-ti-zhong-wen/bang-zhu-zhong-xin/shen-me-shi-eip3589',
      Terms: 'https://docs.daidai.io/private-and-terms/terms-of-service',
      'Privacy Policy': 'https://docs.daidai.io/private-and-terms/privacy-policy',
    }

    const gitbookDataTw = gitbookDataCn

    if (locale == 'en') {
      return gitbookDataEn
    }
    if (locale == 'ja') {
      return gitbookDataJp
    }
    if (locale == 'zh_CN') {
      return gitbookDataCn
    }
    if (locale == 'zh_TW') {
      return gitbookDataTw
    }
    return gitbookDataEn
  }, [locale])

  return (
    <div className="z-10 w-full py-20 mt-20">
      <div className="container px-6 mx-auto">
        <Container maxWidth="full" className="px-6 mx-auto">
          <div className="grid grid-cols-2 gap-10 pt-8 border-t md:grid-cols-3 lg:grid-cols-4 xs:px-6 border-base-200">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-start gap-2">
                <div className="">
                  <LogoIcon width={126} className="text-primary" />
                </div>
              </div>
              <Typography variant="sm">
                {i18n._(t`Our community is building a comprehensive decentralized trading platform for the future of finance. Join
              us!`)}
              </Typography>
              <div className="flex items-center gap-4">
                <a href={ShareUrl.twitter} target="_blank" rel="noreferrer">
                  <TwitterIcon width={20} className="" />
                </a>
                <a href={ShareUrl.telegram} target="_blank" rel="noreferrer">
                  <TelegramIcon width={20} className="" />
                </a>
                <a href={ShareUrl.medium} target="_blank" rel="noreferrer">
                  <MediumIcon width={20} className="" />
                </a>
                <a href={ShareUrl.discord} target="_blank" rel="noreferrer">
                  <DiscordIcon width={20} className="" />
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1 md:text-right lg:text-right">
              <Typography variant="sm" weight={700} className="mt-2.5 hover:text-base-content">
                {i18n._(t`How to Use`)}
              </Typography>
              <a href={getGitbook['Navigating DaiDai']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`Navigating DaiDai`)}
                </Typography>
              </a>
              <a href={getGitbook['How to make a purchase']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`How to make a purchase`)}
                </Typography>
              </a>
              <a href={getGitbook['How to connect other wallets']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`How to connect other wallets`)}
                </Typography>
              </a>
            </div>
            <div className="flex flex-col gap-1 md:text-right lg:text-right">
              <Typography variant="sm" weight={700} className="mt-2.5 hover:text-base-content">
                {i18n._(t`About`)}
              </Typography>
              <a href={getGitbook['What is a wallet']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`What is a wallet`)}
                </Typography>
              </a>
              <a href={getGitbook['About NFT Marketplace']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`About NFT Marketplace`)}
                </Typography>
              </a>
              <a href={getGitbook['About Blockchain']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`About Blockchain`)}
                </Typography>
              </a>
              <a href={getGitbook['What is EIP-3589']} target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`What is EIP-3589`)}
                </Typography>
              </a>
              {/* <a href="https://docs.daidai.io/about-us/daidais-operation-company" target="_blank" rel="noreferrer">
                <Typography variant="sm" className="text-opacity-60 text-base-content hover:text-opacity-100">
                  {i18n._(t`About us`)}
                </Typography>
              </a> */}
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <Typography variant="sm" weight={700} className="mt-2.5 hover:text-base-content">
                {i18n._(t`Language`)}
              </Typography>
              <div className="w-40">
                <LanguageSwitch />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between pt-8 pb-8 mt-8 border-t">
            <Typography variant="sm" className="text-opacity-40 text-base-content">
              {i18n._(t`© 2022 DAIDAI.IO`)}
            </Typography>
            <div className="flex flex-row justify-end gap-4">
              <a href={getGitbook['Terms']} target="_blank" rel="noreferrer">
                <Typography
                  variant="sm"
                  weight={700}
                  className="text-opacity-60 text-base-content hover:text-opacity-100"
                >
                  {i18n._(t`Terms`)}
                </Typography>
              </a>
              <a href={getGitbook['Privacy Policy']} target="_blank" rel="noreferrer">
                <Typography
                  variant="sm"
                  weight={700}
                  className="text-opacity-60 text-base-content hover:text-opacity-100"
                >
                  {i18n._(t`Privacy Policy`)}
                </Typography>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Footer
