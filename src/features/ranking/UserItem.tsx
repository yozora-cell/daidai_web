import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { formatNumber } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { UserTrade } from 'app/types/daidai'
import Link from 'next/link'

const Item = ({ data, index }: { data: UserTrade; index: number }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  return (
    <>
      <tr className="hover:shadow">
        <th>
          <Link href={`/account/${data.account}`}>
            <a className="w-full">
              <div className="flex flex-row items-center justify-start gap-2">
                <Typography weight={700}>{index}</Typography>
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <Image
                      src={data.avatar_url ?? defaultImg}
                      alt="avatar"
                      layout="responsive"
                      width={64}
                      height={64}
                    />
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </th>
        <td>
          <Link href={`/account/${data.account}`}>
            <a className="w-full">
              <Typography weight={700} variant="lg">
                {data.username ?? i18n._(t`Unnamed`)}
              </Typography>
            </a>
          </Link>
        </td>
        {/* <td>
          <Typography>{data.symbol}</Typography>
        </td> */}
        <td>
          <div data-tip={data.volumeEth} className="tooltip">
            <Typography>{formatNumber(data.volumeEth)}</Typography>
          </div>
        </td>
        <td>
          <Typography>{data.trades}</Typography>
        </td>
      </tr>
    </>
  )
}

export default Item
