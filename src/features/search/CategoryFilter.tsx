import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { useCategory } from 'app/services/apis/hooks'
import { Category } from 'app/types/daidai'
// import { setCategorys } from 'app/state/nfts/actions'
import { Fragment, useMemo } from 'react'

// 主要，这里的selectList存的是category的name，所以category里面不可以有相同名字的
const CategoryFilter = ({
  onChangeCategory,
  defaultSelectList,
}: {
  onChangeCategory: (selectList: string[]) => void
  defaultSelectList: string[]
}) => {
  const { i18n } = useLingui()

  // 先默认100
  const limit = 100
  const page = 1
  const { data, error } = useCategory(page, limit)
  const list = useMemo(() => {
    if (data && data.data && data.data.length) {
      return data.data
    }
    return undefined
  }, [data])

  // const [selectList, setSelectList] = useState<string[]>(defaultSelectList)
  const getIsSelect = (category: Category) => {
    const result = defaultSelectList.find((name: string) => {
      return category.title === name
    })
    return result ? true : false
  }

  const toSelectCategory = (category: Category) => {
    if (list) {
      const isSelect = getIsSelect(category)
      let newSelectList = []
      if (isSelect) {
        const res: string[] = []
        defaultSelectList.forEach((name) => {
          if (name !== category.title) {
            res.push(name)
          }
        })
        newSelectList = res
      } else {
        const oldList = [...defaultSelectList]
        oldList.push(category.title)
        newSelectList = oldList
      }
      onChangeCategory(newSelectList)
      // setSelectList(newSelectList)
    }
  }

  return (
    <>
      <div className="w-full border-b">
        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="text-base font-bold collapse-title">{i18n._(t`Category`)}</div>
          <div className="collapse-content">
            <div className="w-full">
              {list && list.length > 0 && (
                <>
                  {list.map((category, index) => (
                    <>
                      <div
                        className="flex flex-row items-center justify-between w-full gap-4 px-2 py-4 rounded cursor-pointer hover:bg-base-200"
                        onClick={() => {
                          toSelectCategory(category)
                        }}
                      >
                        <div className="flex flex-row items-center gap-4">
                          <div className="avatar">
                            <div className="w-5 rounded-full">
                              <Image
                                src={category.image_url ?? defaultImg}
                                // src={defaultImg}
                                alt=""
                                // className="rounded-xl"
                                layout="responsive"
                                width={20}
                                height={20}
                                className="w-5 h-5 "
                              />
                            </div>
                          </div>
                          <div>{category.title}</div>
                        </div>
                        <input type="checkbox" className="checkbox" checked={getIsSelect(category)} />
                      </div>
                    </>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryFilter
