import { LinkIcon } from '@heroicons/react/outline'
import { useLingui } from '@lingui/react'
import CopyHelper from 'app/components/AccountDetails/Copy'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import AssetsNum from 'app/features/account/AssetsNum'
import Image from 'app/features/common/Image'
import { getExplorerLink, shortenAddress } from 'app/functions'
import useENSName from 'app/hooks/useENSName'
import { getProfile } from 'app/services/apis'
import { useActiveWeb3React } from 'app/services/web3'
import { Account } from 'app/types/daidai'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface HeaderProps {
  hideAccount?: boolean
  account: string
}

const Header = ({ account, hideAccount }: HeaderProps) => {
  const { i18n } = useLingui()
  const { library, chainId } = useActiveWeb3React()
  const [show, setShow] = useState<boolean>(false)
  const { ENSName } = useENSName(account ?? undefined)
  const [data, setData] = useState<Account | undefined>(undefined)
  useEffect(() => {
    getProfile(account).then((res) => {
      setData(res)
    })
  }, [account])

  function getAvatar() {
    if (data) {
      return (
        <div className="flex flex-row justify-between w-full">
          <div className="border-base-100 border-[6px] border-solid rounded-full h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] lg:h-[180px] lg:w-[180px] overflow-hidden shadow-lg mt-[-36px] sm:mt-[-86px] lg:mt-[-156px] z-10">
            <div className="relative w-full h-full">
              <Image src={data.avatar_url ? data.avatar_url : defaultImg} alt="avatar" layout="fill" />
            </div>
          </div>
        </div>
      )
    }
    return <></>
  }

  return (
    <>
      {data ? (
        <>
          <div className="w-full bg-base-300 max-h-[320px] overflow-hidden relative">
            <div className="pb-[25%] h-0">
              <Image
                src={data.banner_url ? data.banner_url : defaultImg}
                alt="collection banner"
                layout="fill"
                className="object-cover"
                quality={100}
              />
            </div>
          </div>
          <div className="container px-6">
            <div className="relative z-10 flex flex-col">
              {account && data && data.account && <>{getAvatar()}</>}
              <div className="flex flex-col mt-4">
                {account && data && (
                  <Link href={getExplorerLink(chainId, account, 'address')} passHref={true}>
                    <a target="_blank">
                      <Typography
                        variant="h2"
                        className="flex gap-1 cursor-pointer text-base-content hover:text-primary"
                        weight={700}
                      >
                        {data.username ? data.username : account ? shortenAddress(account) : ''} <LinkIcon width={20} />
                      </Typography>
                    </a>
                  </Link>
                )}
                {account && !hideAccount && (
                  <CopyHelper toCopy={account} className="opacity-100 text-primary">
                    {shortenAddress(account)}
                  </CopyHelper>
                )}
              </div>
              <AssetsNum account={account} data={data}></AssetsNum>
              <div className="w-full mt-9">
                <Typography variant="base" className="leading-normal text-base-content text-opacity-60">
                  <pre className="whitespace-pre-line">{data.bio}</pre>
                </Typography>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default Header
