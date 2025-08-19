import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Image from 'app/features/common/Image'
import { usePostsById } from 'app/services/apis/hooks'
import { Posts } from 'app/types/daidai'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const Event = (content: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { i18n } = useLingui()
  const id = content.props.id
  //   console.log(id)
  const { data } = usePostsById(id)
  //   console.log(data)
  //   const { data } = usePosts()
  const { locale } = useRouter()

  const getTitle = (posts: Posts) => {
    if (locale === 'en') {
      return posts.title
    }
    if (locale === 'ja') {
      return posts.title_jp ?? posts.title
    }
    if (locale === 'zh_CN' || locale === 'zh_TW') {
      return posts.title_cn ?? posts.title
    }
    return posts.title
  }

  const getSubtitle = (posts: Posts) => {
    if (locale === 'en') {
      return posts.subtitle
    }
    if (locale === 'ja') {
      return posts.subtitle_jp ?? posts.subtitle
    }
    if (locale === 'zh_CN' || locale === 'zh_TW') {
      return posts.subtitle_cn ?? posts.subtitle
    }
    return posts.subtitle
  }

  const getDesc = (posts: Posts) => {
    if (locale === 'en') {
      return posts.desc
    }
    if (locale === 'ja') {
      return posts.desc_jp ?? posts.desc
    }
    if (locale === 'zh_CN' || locale === 'zh_TW') {
      return posts.desc_cn ?? posts.desc
    }
    return posts.desc
  }

  const getBody = (posts: Posts) => {
    if (locale === 'en') {
      return posts.body
    }
    if (locale === 'ja') {
      return posts.body_jp ?? posts.body
    }
    if (locale === 'zh_CN' || locale === 'zh_TW') {
      return posts.body_cn ?? posts.body
    }
    return posts.body
  }

  const getHtml = (posts: Posts) => {
    return {
      __html: getBody(posts),
    }
  }

  //   const demoUrl = 'https://ipfstest.daidai.io/ipfs/QmQY4M53yZCXurUHr7oQ3E78Lsme4vkJoPJLt2ErPu6A5G'

  return (
    <>
      {data && (
        <>
          <NextSeo title={`${i18n._(t`Event`)} ${getTitle(data)}`} />
          <div className="w-full bg-base-300 max-h-[320px] overflow-hidden relative">
            <div className="pb-[25%] h-0">
              <Image
                src={data.image_url ?? defaultImg}
                alt="collection banner"
                layout="fill"
                className="object-cover"
                quality={100}
              />
            </div>
            {/* <div
              className="absolute inset-0"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            ></div> */}
          </div>
          <div className="container p-6">
            <div className="flex flex-col items-start justify-center gap-4">
              <Typography className="text-2xl !leading-7 text-base-content md:text-3xl text-left" weight={700}>
                {getTitle(data)}
              </Typography>
              <Typography className="text-base text-base-content md:text-lg">{getSubtitle(data)}</Typography>
            </div>
            <div className="w-full mt-8">
              <div dangerouslySetInnerHTML={getHtml(data)} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

// 参数改为由这里传过去
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      props: {
        id: context.query.id,
      },
    }, // will be passed to the page component as props
  }
}

export default Event
