import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { classNames, isImage } from 'app/functions'
// import Image from 'app/features/common/Image'
import { AttributeData, NameValues } from 'app/types/daidai'
import { useCallback } from 'react'

const AttributesFilter = ({
  defaultProps,
  onChange,
  data,
}: {
  defaultProps: NameValues[]
  onChange: (props: NameValues[]) => void
  data: AttributeData | undefined
}) => {
  console.log('defaultProps', defaultProps)
  // const [selectProps, setSelectProps] = useState(defaultProps)

  const getIsSelect = useCallback(
    (name: string, value: string) => {
      // console.log('getIsSelect', name, value, selectProps, defaultProps, selectProps.length === defaultProps.length)
      const result = defaultProps.find((prop) => {
        return prop.name === name && prop.values === value
      })
      return result ? true : false
    },
    [defaultProps]
  )

  const toSelectAttr = (name: string, value: string) => {
    if (data?.attributes) {
      const isSelect = getIsSelect(name, value)
      let newSelectList: NameValues[] = []
      if (isSelect) {
        const res: NameValues[] = []
        defaultProps.forEach((prop) => {
          if (!(name === prop.name && value === prop.values)) {
            res.push(prop)
          }
        })
        newSelectList = res
      } else {
        const oldList = [...defaultProps]
        oldList.push({
          name: name,
          values: value,
        })
        newSelectList = oldList
      }
      onChange(newSelectList)
      // setSelectProps(newSelectList)
    }
  }

  const isActive = (name: string) => {
    const result = defaultProps.find((prop) => {
      return prop.name === name
    })
    return result ? true : false
  }

  return (
    <>
      {data && data.attributes && data.attributes.length > 0 && (
        <>
          <div className="w-full border-b">
            {data.attributes.map((attribute) => (
              <>
                <div className="collapse collapse-arrow">
                  <input type="checkbox" />
                  <div
                    className={classNames(
                      'text-base font-bold collapse-title',
                      isActive(attribute.name) ? 'text-info' : ''
                    )}
                  >
                    {attribute.name}
                  </div>
                  <div className="collapse-content">
                    <div className="w-full">
                      {attribute.values && attribute.values.length > 0 && (
                        <>
                          {attribute.values.map((value, index) => (
                            <>
                              <div
                                className="flex flex-row items-center justify-between w-full gap-4 px-2 py-4 rounded cursor-pointer hover:bg-base-200"
                                onClick={() => {
                                  toSelectAttr(attribute.name, value.key)
                                }}
                              >
                                <div className="flex flex-row items-center justify-between flex-grow w-full gap-4">
                                  {isImage(value.key) ? (
                                    <>
                                      <div className="flex flex-row items-center justify-start flex-grow gap-4">
                                        {/** 这里用img的原因是因为Image组件会因为404而不断地进行请求 */}
                                        <img
                                          src={value.key ?? defaultImg}
                                          // src={defaultImg}
                                          className="w-6 h-6"
                                          onError={(e: any) => {
                                            e.target.src = defaultImg
                                          }}
                                        />
                                        <Typography variant="base" className="truncate text-ellipsis max-w-[140px]">
                                          {value.key}
                                        </Typography>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <Typography variant="base" className="truncate text-ellipsis max-w-[180px]">
                                        {value.key}
                                      </Typography>
                                    </>
                                  )}
                                  <Typography variant="base" className="text-base-content text-opacity-60">
                                    {value.count}
                                  </Typography>
                                </div>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={getIsSelect(attribute.name, value.key)}
                                />
                              </div>
                            </>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default AttributesFilter
