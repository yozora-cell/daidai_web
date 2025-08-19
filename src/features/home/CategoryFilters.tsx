import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { useCategory } from 'app/services/apis/hooks'
// import { setCategorys } from 'app/state/nfts/actions'
import { Category } from 'app/types/daidai'
import { Fragment, useMemo, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { useGetCategorys } from 'app/state/nfts/hooks'

export default function CategoryFilters({
  onChangeCategory,
  defaultValue,
}: {
  onChangeCategory: (category: string) => void
  defaultValue: string
}) {
  const { i18n } = useLingui()
  // const dispatch = useDispatch()

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
  // console.log('filter list', list)

  const defaultSelected = useMemo(() => {
    if (defaultValue && list && list.length > 0) {
      return list.find((item) => {
        return item.id == defaultValue
      })
    }
    return undefined
  }, [defaultValue, list])
  // console.log('default value', defaultValue, defaultSelected)

  const [selected, setSelected] = useState<Category | undefined>(undefined)

  const showTagRender = (category: Category) => {
    return (
      <div className="flex flex-row items-center justify-between w-full gap-2">
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
        <SelectorIcon className="w-4" aria-hidden="true" />
      </div>
    )
  }

  return (
    <>
      <div>
        <Listbox
          value={selected ?? defaultSelected}
          onChange={(selected) => {
            setSelected(selected)
            if (selected) {
              onChangeCategory(selected.id)
              // dispatch(setCategorys(selected.id))
            } else {
              onChangeCategory('')
              // dispatch(setCategorys(''))
            }
          }}
        >
          <div className="relative">
            <Listbox.Button className="relative flex flex-row items-center w-full">
              <button className="w-40 gap-2 btn btn-outline btn-sm">
                {selected ? (
                  <>{showTagRender(selected)}</>
                ) : (
                  <>
                    {defaultSelected ? (
                      <>{showTagRender(defaultSelected)}</>
                    ) : (
                      <>
                        {i18n._(t`Category`)}
                        <SelectorIcon className="w-4" aria-hidden="true" />
                      </>
                    )}
                  </>
                )}
              </button>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 overflow-auto shadow-lg bg-base-100 max-h-80">
                <Listbox.Option
                  key={`-1-1`}
                  className={({ active }) => `cursor-pointer select-none relative p-4 ${active ? 'bg-base-200' : ''}`}
                  value={undefined}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex flex-row items-center justify-start w-full gap-4">
                        <div className="avatar">
                          <div className="w-5 rounded-full">
                            <Image
                              src={defaultImg}
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
                        <div className="flex flex-row items-center justify-between grow-1">
                          <Typography className="w-full truncate" weight={700}>
                            {i18n._(t`ALL`)}
                          </Typography>
                          {selected ? <CheckIcon className="w-5 h-5 text-info" aria-hidden="true" /> : null}
                        </div>
                      </div>
                    </>
                  )}
                </Listbox.Option>
                {list?.map((item, index) => (
                  <Listbox.Option
                    key={`${item.id}/${index}`}
                    className={({ active }) => `cursor-pointer select-none relative p-4 ${active ? 'bg-base-200' : ''}`}
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex flex-row items-center justify-start w-full gap-4">
                          <div className="avatar">
                            <div className="w-5 rounded-full">
                              <Image
                                src={item.image_url ?? defaultImg}
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
                          <div className="flex flex-row items-center justify-between grow-1">
                            <Typography className="w-full truncate" weight={700}>
                              {item.title}
                            </Typography>
                            {selected ? <CheckIcon className="w-5 h-5 text-info" aria-hidden="true" /> : null}
                          </div>
                        </div>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  )
}
