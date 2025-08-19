import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { classNames } from 'app/functions'
import { useEffect, useState } from 'react'
import { SizeMe } from 'react-sizeme'

const AutoFitImage = ({
  imageUrl,
  defaultWidthStyle,
  defaultHeightStyle,
  roundedClassName,
}: {
  imageUrl: string
  defaultWidthStyle: string
  defaultHeightStyle: string
  roundedClassName: string
}) => {
  const [width, setWidth] = useState(0)
  const [naturalWidth, setNaturalWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [naturalHeight, setNaturalHeight] = useState(0)
  const [boxWidth, setBoxWidth] = useState(0)
  const [boxHeight, setBoxHeight] = useState(0)
  const [isLoadEnd, setIsLoadEnd] = useState(false)

  const getResponseHeight = (naturalWidth: number, naturalHeight: number, width: number) => {
    return (width * naturalHeight) / naturalWidth
  }

  const getResponseWidth = (naturalWidth: number, naturalHeight: number, height: number) => {
    return (height * naturalWidth) / naturalHeight
  }

  useEffect(() => {
    if (naturalWidth > 0 && naturalHeight > 0 && boxWidth > 0 && boxHeight > 0) {
      if (naturalWidth > naturalHeight) {
        setWidth(boxWidth)
        setHeight(getResponseHeight(naturalWidth, naturalHeight, boxWidth))
      } else {
        setHeight(boxHeight)
        setWidth(getResponseWidth(naturalWidth, naturalHeight, boxHeight))
      }
    }
  }, [naturalWidth, naturalHeight, boxWidth, boxHeight])

  return (
    <>
      <SizeMe>
        {({ size }) => (
          <>
            <div
              className="flex flex-row items-center justify-center w-full my-box"
              style={{
                height: size.width ? size.width + 'px' : defaultHeightStyle,
              }}
            >
              <div
                className={classNames(
                  'relative w-full my-image',
                  isLoadEnd == false ? 'bg-base-300 animate-pulse' : '',
                  roundedClassName
                )}
                style={{
                  width: width ? width + 'px' : size.width ? size.width + 'px' : defaultWidthStyle,
                  height: height ? height + 'px' : size.width ? size.width + 'px' : defaultHeightStyle,
                }}
              >
                <Image
                  src={imageUrl ?? defaultImg}
                  alt="nft image"
                  layout="fill"
                  className={classNames('object-cover', isLoadEnd == false ? 'opacity-0' : '', roundedClassName)}
                  onLoadingComplete={(img) => {
                    // console.log('autoFixImage img', imageUrl, img)
                    setIsLoadEnd(true)
                    setNaturalWidth(img.naturalWidth)
                    setNaturalHeight(img.naturalHeight)
                    if (size.width != null) {
                      setBoxHeight(size.width)
                      setBoxWidth(size.width)
                    }
                  }}
                  // onError={(error) => {
                  //   console.log('autoFixImage error', error, imageUrl)
                  // }}
                />
              </div>
            </div>
          </>
        )}
      </SizeMe>
    </>
  )
}
export default AutoFitImage
