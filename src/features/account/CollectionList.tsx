import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import { useProfileCollectibles } from 'app/services/apis/hooks'

import CollectionItem from './CollectionItem'

const CollectionList = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
  const data = useProfileCollectibles(account)
  return (
    <>
      {data && Object.keys(data).length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <table className="table w-full">
              <thead className="border-b">
                <tr>
                  <th className="bg-base-100">{i18n._(t`Collection`)}</th>
                  <th className="bg-base-100"></th>
                  <th className="text-right bg-base-100">{i18n._(t`Volume(ETH)`)}</th>
                  <th className="text-right bg-base-100">{i18n._(t`Item`)}</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(data).map((address) => {
                  return (
                    <CollectionItem
                      address={address}
                      key={`${address}/${Math.random()}`}
                      tokenIds={data[address]}
                    ></CollectionItem>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <></>
      )}
      {data && Object.keys(data).length == 0 ? (
        <>
          <NoData></NoData>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default CollectionList
