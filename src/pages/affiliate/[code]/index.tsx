import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Code from 'app/features/affiliate/Code'
import SignGuard from 'app/guards/Sign'
import { useActiveWeb3React } from 'app/services/web3'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'

const Affiliate = (content: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const code = content.props.code
  // console.log('code', code)
  return (
    <>
      <NextSeo title={`${i18n._(t`Affiliate`)} ${code}`} />
      <div className="container px-6">
        <Code code={code}></Code>
      </div>
    </>
  )
}

// 参数改为由这里传过去
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      props: {
        code: context.query.code,
      },
    }, // will be passed to the page component as props
  }
}

Affiliate.Guard = SignGuard(false)
export default Affiliate
