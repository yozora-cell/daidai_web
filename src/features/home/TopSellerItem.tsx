// import { BadgeCheckIcon } from '@heroicons/react/solid'
import Typography from 'app/components/Typography'
// import Image from 'next/image'

export interface TopSellerItem {
  index: number
  avatar: string
  ens: string
  price: number
}
// 这里暂时又不用了
const TopSellerItem = (item: TopSellerItem) => {
  return (
    <div className="flex flex-row items-center">
      <Typography variant="base" className="text-opacity-60 text-base-content">
        {item.index}
      </Typography>
    </div>
  )
}

export default TopSellerItem
