// import { ArrowDownIcon } from '@heroicons/react/solid'
// import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { fetchAPI } from '../../lib/api'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
// import { Feature } from 'app/enums/Feature'
// import NetworkGuard from 'app/guards/Network'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'

const Home = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  return (
    <>
      <NextSeo title="Demo" />
      <div className="container mx-auto">
        {account ? (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -m-4">
                <div className="p-4 xl:w-1/3 md:w-1/2">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <Link href="/demo/currencySearch">
                      <a className="mb-2 text-lg font-medium text-gray-900 title-font">currency search</a>
                    </Link>
                    <p className="text-base leading-relaxed">
                      点击按钮出现一个token选择的模态框，可以进行列表选择和检索
                    </p>
                  </div>
                </div>
                <div className="p-4 xl:w-1/3 md:w-1/2">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <Link href="/demo/approve">
                      <a className="mb-2 text-lg font-medium text-gray-900 title-font">approve</a>
                    </Link>
                    <p className="text-base leading-relaxed">暂时只是对sushi的合约进行approve测试</p>
                  </div>
                </div>
                <div className="p-4 xl:w-1/3 md:w-1/2">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <Link href="/demo/signin">
                      <a className="mb-2 text-lg font-medium text-gray-900 title-font">please sign in</a>
                    </Link>
                    <p className="text-base leading-relaxed">对于一些需要登录的页面，做一个引导登录的提示</p>
                  </div>
                </div>
                <div className="p-4 xl:w-1/3 md:w-1/2">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <Link href="/demo/tokenList">
                      <a className="mb-2 text-lg font-medium text-gray-900 title-font">token list</a>
                    </Link>
                    <p className="text-base leading-relaxed">
                      对于特定的routing（业务），设定支持的token列表，支持过滤
                    </p>
                  </div>
                </div>
                <div className="p-4 xl:w-1/3 md:w-1/2">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div>
                      <span className="mb-2 text-lg font-medium text-gray-900 title-font">
                        version {process.env.NEXT_PUBLIC_APP_VERSION}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed">package.json中的version</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <Typography variant="base" className="py-2 text-center">
              Please click connect wallet to continue
            </Typography>

            <Button fullWidth color="primary" onClick={toggleWalletModal} className="rounded-2xl md:rounded">
              connect wallet
            </Button>
          </>
        )}
      </div>
    </>
  )
}
// Home.Guard = NetworkGuard(Feature.HOME)
export default Home
