import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { ApprovalTarget } from 'app/hooks/useNFT'
import { useAppDispatch } from 'app/state/hooks'
import { updateTokenApprovalStage } from 'app/state/nfts/actions'
import { useGetTokenApprovalStageSet } from 'app/state/nfts/hooks'
import { NFTItemStage } from 'app/types/daidai'
import { useEffect, useMemo } from 'react'

import ApprovalToken from './ApprovalToken'

const ApprovalTokenMul = ({
  balances,
  changeStage,
  curStage,
  approvalTarget,
}: {
  balances: Assets[]
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  approvalTarget: ApprovalTarget
}) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()

  const approvalSet = useGetTokenApprovalStageSet()
  const changeStageByIndex = (index: number, stage: NFTItemStage) => {
    // console.log('stage', index, stage == NFTItemStage.APPROVED ? 'approval' : 'false', approvalSet)
    if (stage == NFTItemStage.APPROVED) {
      dispatch(
        updateTokenApprovalStage({
          index: index,
          stage: stage,
        })
      )
    }
  }

  const isAllApproval = useMemo(() => {
    if (approvalSet.length == 0) {
      return false
    }
    // 检测里面是否已经有了所有的序号存在
    const tempSet = new Set<number>()
    approvalSet.forEach((value) => {
      tempSet.add(value)
    })
    // console.log('tempSet', tempSet)
    return tempSet.size == balances.length
  }, [approvalSet, balances.length])

  useEffect(() => {
    // console.log('isAllApproval', isAllApproval, approvalSet)
    if (isAllApproval) {
      changeStage(NFTItemStage.APPROVED)
    }
  }, [approvalSet, changeStage, isAllApproval])

  return (
    <>
      <div className="w-full mt-2 overflow-x-auto">
        <table className="table w-full mx-auto">
          <thead className="border-b">
            <tr>
              <th className="bg-base-100">{i18n._(t`Asset`)}</th>
              <th className="text-right bg-base-100">{i18n._(t`Approval state`)}</th>
            </tr>
          </thead>
          <tbody className="">
            {balances.map((item, i) => (
              <tr key={i}>
                <th className="flex flex-row items-center">
                  <CurrencyLogo currency={item.asset.currency} className="!rounded-full" size={48} />
                  <Typography weight={400} variant="sm" className="inline-flex ml-4 text-base-content">
                    {item.asset.currency.symbol}
                  </Typography>
                </th>
                <td className="text-right">
                  <ApprovalToken
                    tokenAddress={item.asset.currency.wrapped.address}
                    curStage={NFTItemStage.NOT_APPROVED}
                    changeStage={(stage) => {
                      changeStageByIndex(i, stage)
                    }}
                    approvalTarget={approvalTarget}
                  ></ApprovalToken>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ApprovalTokenMul
