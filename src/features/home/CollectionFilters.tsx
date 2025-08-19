import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { classNames } from 'app/functions'
import { useCollections } from 'app/services/apis/hooks'
// import { setCollection } from 'app/state/nfts/actions'
// import { useGetCollection } from 'app/state/nfts/hooks'
import { BASE_INO_OR_COLLECTION } from 'app/types/daidai'
import { Fragment, useMemo, useState } from 'react'
// import { useDispatch } from 'react-redux'

export default function CollectionFilters({
  onChangeCollection,
  defaultValue,
  // 展示特定的collection
  filterSet,
  isRight,
}: {
  onChangeCollection: (collection: string) => void
  defaultValue: string
  filterSet?: Set<string>
  isRight?: boolean
}) {
  const { i18n } = useLingui()
  // const dispatch = useDispatch()
  // const collection = useGetCollection()

  // 先默认100
  const limit = 100
  const page = 1
  const { data, error } = useCollections(page, limit)
  const list = useMemo(() => {
    if (data && data.data && data.data.length) {
      // console.log('filterSet', filterSet)
      // 过滤
      if (filterSet && filterSet.size > 0) {
        const result: BASE_INO_OR_COLLECTION[] = []
        data.data.forEach((item) => {
          // console.log('test', item)
          if (filterSet.has(item.address.toLocaleLowerCase())) {
            result.push(item)
          }
        })
        return result
      } else {
        return data.data
      }
    }
    return undefined
  }, [data, filterSet])
  // console.log('filter list', list)

  const [selected, setSelected] = useState<BASE_INO_OR_COLLECTION | undefined>(undefined)

  const defaultSelected = useMemo(() => {
    if (defaultValue && list && list.length > 0) {
      return list.find((item) => {
        return item.address.toLocaleLowerCase() == defaultValue.toLocaleLowerCase()
      })
    }
    return undefined
  }, [defaultValue, list])

  const showTagRender = (collection: BASE_INO_OR_COLLECTION) => {
    return (
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div className="avatar">
          <div className="w-5 rounded-full">
            <Image
              src={collection.avatar ?? defaultImg}
              alt=""
              // className="rounded-xl"
              layout="responsive"
              width={20}
              height={20}
              className="w-5 h-5 "
            />
          </div>
        </div>
        <div>{collection.name}</div>
        <SelectorIcon className="w-4" aria-hidden="true" />
      </div>
    )
  }

  // useEffect(() => {
  //   if (selected) {
  //     onChangeCollection(selected.address)
  //     dispatch(setCollection(selected.address))
  //   }
  // }, [dispatch, onChangeCollection, selected])

  return (
    <>
      <div>
        <Listbox
          value={selected ?? defaultSelected}
          onChange={(selected) => {
            setSelected(selected)
            if (selected) {
              onChangeCollection(selected.address)
              // if (isUpdateToStore) {
              //   dispatch(setCollection(selected.address))
              // }
            } else {
              onChangeCollection('')
              // if (isUpdateToStore) {
              //   dispatch(setCollection(''))
              // }
            }
          }}
        >
          <div className="relative">
            <Listbox.Button className="relative flex flex-row items-center">
              <button className="gap-2 btn btn-outline btn-sm">
                {selected ? (
                  <>{showTagRender(selected)}</>
                ) : (
                  <>
                    {defaultSelected ? (
                      <>{showTagRender(defaultSelected)}</>
                    ) : (
                      <>
                        {i18n._(t`Collection`)}
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
              <Listbox.Options
                className={classNames(
                  'absolute z-20 overflow-auto shadow-lg bg-base-100 max-h-80',
                  isRight ? 'right-0' : ''
                )}
              >
                <Listbox.Option
                  key={`collection filters all`}
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
                          <Typography className="w-48 truncate" weight={700}>
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
                    key={`${item.address}/${index}`}
                    className={({ active }) => `cursor-pointer select-none relative p-4 ${active ? 'bg-base-200' : ''}`}
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex flex-row items-center justify-start w-full gap-4">
                          <div className="avatar">
                            <div className="w-5 rounded-full">
                              <Image
                                src={item.avatar ?? defaultImg}
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
                            <Typography className="w-48 truncate" weight={700}>
                              {item.name}
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
