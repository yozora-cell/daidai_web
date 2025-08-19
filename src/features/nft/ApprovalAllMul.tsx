import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { ApprovalTarget } from 'app/hooks/useNFT'
import { useAppDispatch } from 'app/state/hooks'
import { updateApprovalStage } from 'app/state/nfts/actions'
import { useGetApprovalStageSet } from 'app/state/nfts/hooks'
import { NFTDetail, NFTItemStage } from 'app/types/daidai'
import { SimpleCollection } from 'app/types/daidai'
import { useEffect, useMemo } from 'react'

import ApprovalAll from './ApprovalAll'

const ApprovalAllMul = ({
  list,
  changeStage,
  curStage,
  approvalTarget,
}: {
  list: NFTDetail[]
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  approvalTarget: ApprovalTarget
}) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const approvalSet = useGetApprovalStageSet()
  //   console.log('approvalSet', approvalSet)

  const collectionList = useMemo(() => {
    const set = new Set<String>()
    const result: SimpleCollection[] = []
    list.forEach((data) => {
      if (data.contract && data.collection && set.has(data.contract) == false) {
        result.push(data.collection)
        set.add(data.contract)
      }
    })
    return result
  }, [list])

  const changeStageByIndex = (index: number, stage: NFTItemStage) => {
    // console.log('stage', index, stage == NFTItemStage.APPROVED ? 'approval' : 'false', approvalSet)
    if (stage == NFTItemStage.APPROVED) {
      dispatch(
        updateApprovalStage({
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
    return tempSet.size == collectionList.length
  }, [approvalSet, collectionList.length])

  useEffect(() => {
    // console.log('isAllApproval', isAllApproval, approvalSet)
    if (isAllApproval) {
      changeStage(NFTItemStage.APPROVED)
    }
  }, [approvalSet, changeStage, isAllApproval])

  return (
    <>
      <div className="w-full pt-4 mt-4 border-t">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="border-b">
              <tr>
                <th className="bg-base-100">{i18n._(t`Collection`)}</th>
                <th className="bg-base-100"></th>
                <th className="bg-base-100">{i18n._(t`Approval state`)}</th>
              </tr>
            </thead>
            <tbody>
              {collectionList.map((item, index) => {
                return (
                  <>
                    <tr key={`approvalAllMul_${index}`}>
                      <th>
                        <Image src={item.banner ?? defaultImg} alt="nft image" layout="fill" className="object-cover" />
                      </th>
                      <th>{item.name}</th>
                      <th>
                        <ApprovalAll
                          key={`approvalAllMul_approvall_${index}`}
                          contract={item.address}
                          curStage={NFTItemStage.NOT_APPROVED}
                          approvalTarget={approvalTarget}
                          changeStage={(stage) => {
                            changeStageByIndex(index, stage)
                          }}
                        ></ApprovalAll>
                      </th>
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ApprovalAllMul
