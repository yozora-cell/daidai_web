import AutoFitImage from 'app/components/AutoFitImage'
import ModalImage from 'app/components/ModalImage'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { NFTDetail } from 'app/types/daidai'
import { useMemo, useState } from 'react'
import { SizeMe } from 'react-sizeme'

enum MediaType {
  NULL = 0,
  IMAGE = 1,
  AUDIO = 2,
  VIDEO = 3,
}

const Picture = ({ data }: { data: NFTDetail }) => {
  const [isOpen, setIsOpen] = useState(false)
  const breakpoint = useBreakPointMediaQuery()
  const isSm = useMemo(() => {
    if (breakpoint == BreakPoint.DEFAULT || breakpoint == BreakPoint.SM) {
      return true
    }
    return false
  }, [breakpoint])

  const mediaType = useMemo(() => {
    if (data && data.image) {
      if (!data.animation_url) {
        return MediaType.IMAGE
      } else {
        if (data.animation_url.toLocaleLowerCase().endsWith('.mp4')) {
          return MediaType.VIDEO
        } else if (data.animation_url.toLocaleLowerCase().endsWith('.mp3')) {
          return MediaType.AUDIO
        } else {
          return MediaType.IMAGE
        }
      }
    } else {
      return MediaType.NULL
    }
  }, [data])

  const imageRender = () => {
    return (
      <>
        {isSm ? (
          <>
            <a href={data.image} target="_self" rel="noreferrer" className="w-full h-auto">
              <AutoFitImage
                imageUrl={data.image ?? ''}
                defaultWidthStyle={'100%'}
                defaultHeightStyle={'510'}
                roundedClassName={''}
              ></AutoFitImage>
            </a>
          </>
        ) : (
          <>
            <div
              className="cursor-zoom-in"
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            >
              <AutoFitImage
                imageUrl={data.image ?? ''}
                defaultWidthStyle={'100%'}
                defaultHeightStyle={'510'}
                roundedClassName={''}
              ></AutoFitImage>
            </div>
            <ModalImage
              url={data.image ?? ''}
              isOpen={isOpen}
              dismiss={() => {
                setIsOpen(false)
              }}
            ></ModalImage>
          </>
        )}
      </>
    )
  }

  // console.log('mediaType', mediaType)

  return (
    <div>
      {mediaType == MediaType.NULL && (
        <>
          <Image src={defaultImg} alt="" layout="responsive" width={510} height={510} />
        </>
      )}
      {mediaType == MediaType.IMAGE && <>{imageRender()}</>}
      {mediaType == MediaType.AUDIO && (
        <>
          {imageRender()}
          <SizeMe>
            {({ size }) => (
              <>
                <div className="px-4">
                  <audio
                    // autoPlay
                    controls
                    className="w-full -mt-16"
                  >
                    <source src={data.animation_url} type="audio/mpeg" />
                  </audio>
                </div>
              </>
            )}
          </SizeMe>
        </>
      )}
      {mediaType == MediaType.VIDEO && (
        <>
          <SizeMe>
            {({ size }) => (
              <>
                <video
                  width={size.width ?? '100%'}
                  height={size.height ?? '100%'}
                  controls
                  playsInline
                  muted
                  autoPlay
                  poster={data.image}
                >
                  <source src={data.animation_url} type="video/mp4" />
                </video>
              </>
            )}
          </SizeMe>
        </>
      )}
    </div>
  )
}
export default Picture
