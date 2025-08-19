import { SearchIcon, XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import AutoFitImage from 'app/components/AutoFitImage'
import Dots from 'app/components/Dots'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { classNames } from 'app/functions'
import { useSearch } from 'app/services/apis/hooks'
import Lottie from 'lottie-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { DebounceInput } from 'react-debounce-input'
// import { SimpleCollection } from 'types/daidai'

const SearchInput = ({ autoFocus }: { autoFocus: boolean }) => {
  const router = useRouter()
  const { i18n } = useLingui()
  const [isHover, setIsHover] = useState(false)
  const [value, setValue] = useState(router.query['query'] ? String(router.query['query']) : '')
  const limit = 10
  const page = 1
  // console.log('value', value)
  const [isOpen, setIsOpen] = useState(false)
  // 通过控制value的传递来控制是否要执行查询
  const query = useMemo(() => {
    if (isOpen) {
      return value
    } else {
      return ''
    }
  }, [isOpen, value])
  const { data, error, isValidating } = useSearch(query, page, limit)
  // const collectionList = useMemo<SimpleCollection[] | null>(() => {
  //   if (data && data.data && data.data.length > 0) {
  //     const list: SimpleCollection[] = []
  //     const set = new Set()
  //     data.data.map((item) => {
  //       if (item.collection) {
  //         if (!set.has(item.collection.address)) {
  //           set.add(item.collection.address)
  //           list.push(item.collection)
  //         }
  //       }
  //     })
  //     return list
  //   } else {
  //     return null
  //   }
  // }, [data])
  // console.log(data, error, isValidating)

  const goToSerachPage = () => {
    router.push(`/search?query=${encodeURIComponent(value)}`)
  }

  useEffect(() => {
    // 离开路由前对参数进行清空
    router.events.on('beforeHistoryChange', (url) => {
      setIsOpen(false)
    })
  })

  return (
    <>
      <div
        className="relative flex flex-grow form-control"
        onBlur={() => {
          setTimeout(() => {
            setIsOpen(false)
          }, 300)
        }}
      >
        <div
          className={classNames(
            'flex flex-row items-center w-full border input-group hover:!border-primary rounded py-1 transition-all',
            value ? '!border-primary' : ''
          )}
          style={{
            borderColor: 'transparent',
          }}
          onMouseOver={() => {
            setIsHover(true)
          }}
          onMouseOut={() => {
            setIsHover(false)
          }}
        >
          <div className="pl-2">
            <SearchIcon
              className={classNames('w-6 h-6 text-base-300 transition-all', isHover || value ? '!text-primary' : '')}
            />
          </div>
          <DebounceInput
            type="text"
            placeholder="Search items"
            className="flex flex-grow input input-bordered !border-0 !h-auto !outline-none input-lg"
            style={{
              background: 'transparent',
            }}
            onChange={(event) => {
              setValue(event.target.value)
            }}
            debounceTimeout={500}
            onFocus={() => {
              setIsOpen(true)
            }}
            value={value}
            autoFocus={autoFocus}
            onKeyDown={(event) => {
              if (event.code === 'Enter') {
                goToSerachPage()
              }
            }}
          />
          {value && (
            <>
              <div
                className="px-2"
                onClick={() => {
                  setValue('')
                }}
              >
                <XIcon className="w-6 h-6 cursor-pointer opacity-40"></XIcon>
              </div>
            </>
          )}
        </div>
        {value && isOpen && (
          <>
            <div className="absolute left-0 w-full top-full">
              <div className="flex flex-col w-full mt-2 overflow-y-scroll rounded shadow-lg bg-base-100 max-h-96">
                {!isValidating && data?.collections && data?.collections.length > 0 && (
                  <>
                    <div className="p-4 border-b">
                      <Typography variant="base" className="!text-opacity-40 text-base-content" weight={700}>
                        {i18n._(t`Collections`)}
                      </Typography>
                    </div>
                    {data.collections.map((item) => (
                      <>
                        <Link href={`/collection/${item?.chainId}/${item.address}`}>
                          <a className="w-full">
                            <div className="flex flex-row items-center justify-start gap-4 p-4 transition-all border-b hover:bg-base-200">
                              <div className="w-10 h-10">
                                <AutoFitImage
                                  imageUrl={item.avatar ? item.avatar : item.cover ?? defaultImg}
                                  defaultWidthStyle={'100%'}
                                  defaultHeightStyle={'40px'}
                                  roundedClassName="rounded-md"
                                ></AutoFitImage>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Typography variant="base" weight={700}>
                                  {item.name}
                                </Typography>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </>
                    ))}
                  </>
                )}
                <div className="p-4 border-b">
                  <Typography variant="base" className="!text-opacity-40 text-base-content" weight={700}>
                    {i18n._(t`NFTs`)}
                  </Typography>
                </div>
                <div className="w-full">
                  {!isValidating && data && data.data && (
                    <>
                      {data.data.map((item) => (
                        <>
                          <Link href={`/collection/${item?.chainId}/${item?.contract}/${item?.tokenId}`}>
                            <a className="w-full">
                              <div className="flex flex-row items-center justify-start gap-4 p-4 transition-all border-b hover:bg-base-200">
                                <div className="w-10 h-10">
                                  <AutoFitImage
                                    imageUrl={item.image ?? defaultImg}
                                    defaultWidthStyle={'100%'}
                                    defaultHeightStyle={'40px'}
                                    roundedClassName="rounded-md"
                                  ></AutoFitImage>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Typography variant="base" weight={700}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="sm" className="!text-opacity-60 text-base-content">
                                    {item.collection?.name}
                                  </Typography>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </>
                      ))}
                    </>
                  )}
                  {!isValidating && !(data && data.data && data.data.length > 0) && (
                    <>
                      <div className="p-4">
                        <Typography variant="base" className="!text-opacity-40 text-base-content" weight={700}>
                          {i18n._(t`No items found`)}
                        </Typography>
                      </div>
                    </>
                  )}
                  {isValidating && (
                    <>
                      <div className="flex gap-4 p-4">
                        <div className="w-5 h-5">
                          <Lottie animationData={loadingCircle} autoplay loop />
                        </div>
                        <Typography weight={700} className="!text-opacity-40 text-base-content">
                          <Dots>{i18n._(t`Loading`)}</Dots>
                        </Typography>
                      </div>
                    </>
                  )}
                </div>
                {!isValidating && data && data.data && data.data.length > 0 && (
                  <>
                    <div
                      className="p-4 cursor-pointer hover:bg-base-200"
                      onClick={() => {
                        goToSerachPage()
                      }}
                    >
                      <Typography variant="base" className="!text-opacity-40 text-base-content" weight={700}>
                        {i18n._(t`Press Enter to search all items`)}
                      </Typography>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default SearchInput
