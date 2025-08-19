import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { useCollection } from 'app/services/apis/hooks'
import Link from 'next/link'

const CollectionItem = ({ address, tokenIds }: { address: string; tokenIds: string[] }) => {
  const { data, error } = useCollection(address)
  //   console.log('CollectionItem data', data, error)
  return data ? (
    <tr className="">
      <th className="">
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
            <Link href={`/collection/${data.chainId}/${data.address}`}>
              <a>
                <Image
                  src={data.avatar ? data.avatar : defaultImg}
                  alt="avatar"
                  // className="rounded-xl"
                  layout="responsive"
                  width={64}
                  height={64}
                />
              </a>
            </Link>
          </div>
        </div>
      </th>
      <td>
        <Link href={`/collection/${data.chainId}/${data.address}`}>
          <a className="w-full">
            <Typography variant="base" className="inline-flex ml-4 text-base-content">
              {data.name}
            </Typography>
          </a>
        </Link>
      </td>
      <td className="text-right">
        <div className="flex flex-row items-center justify-end w-full">
          <Typography variant="base" className="inline-flex mr-4 text-base-content">
            {data.floorPrice}
          </Typography>
          {/* <Image src="/images/daidai/demo3.png" alt="avatar" className="" layout="responsive" width={32} height={32} /> */}
        </div>
      </td>
      <td className="text-right">{tokenIds && tokenIds.length ? tokenIds.length : 1}</td>
    </tr>
  ) : (
    <></>
  )
}
export default CollectionItem
