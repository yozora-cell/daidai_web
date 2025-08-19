import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
// import { Feature } from 'app/enums/Feature'
import Image from 'app/features/common/Image'
// import NetworkGuard from 'app/guards/Network'
import SignGuard from 'app/guards/Sign'
import { getProfile, updateProfile } from 'app/services/apis'
import { profile } from 'app/services/apis/keys'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

interface StateType {
  username: string
  account: string
  email: string
  bio: string
  avatar_file: undefined | File // File
  banner_file: undefined | File // File

  banner_url: string | undefined
  avatar_url: string | undefined
  avatar_base64: undefined | string
  banner_base64: undefined | string
}

const Settings = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { mutate } = useSWRConfig()

  const addPopup = useAddPopup()

  // 支持的后缀
  const supportExtends = ['gif', 'ico', 'png', 'svg', 'webp', 'jpg', 'jpeg', 'bmp']

  const [state, setState] = useState<StateType>({
    username: '',
    email: '',
    bio: '',
    account: '',
    banner_url: '',
    avatar_url: '',

    avatar_file: undefined, // File
    avatar_base64: undefined,
    banner_file: undefined, // File
    banner_base64: undefined,
  })

  const [userNameError, setUserNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const [bannerError, setBannerError] = useState(false)
  const [success, setSuccess] = useState(false)

  const [userNameErrorMsg, setUserNameErrorMsg] = useState(i18n._(t`please fill the text`))
  const [emailErrorMsg, setEmailErrorMsg] = useState(i18n._(t`please fill the text`))
  const [avatarErrorMsg, setAvatarErrorMsg] = useState(i18n._(t`please fill the text`))
  const [bannerErrorMsg, setBannerErrorMsg] = useState(i18n._(t`please fill the text`))
  const [errorMsg, setErrorMsg] = useState(i18n._(t`have error, please check`))
  const [successMsg, setSuccessMsg] = useState(i18n._(t`update successful!`))

  // confirm的loading
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    if (account) {
      // 获取用户数据
      getProfile(account).then((res) => {
        setState((oldValue) => ({ ...oldValue, ...res }))
      })
    }
  }, [account])

  const handleChange = (e: any) => {
    if (e.target.name === 'avatar_file' || e.target.name === 'banner_file') {
      let file = e.target.files[0]
      // 这里有可能用户选择完图片之后，再次选择一个空的，这里就会报错
      if (file) {
        // 这里判断文件后缀
        const extension = file.name.split('.')
        // console.log('后缀', extension[extension.length - 1])
        let isSupport = false
        supportExtends.forEach((item, i) => {
          if (item === extension[extension.length - 1]) {
            isSupport = true
          }
        })
        if (isSupport === false) {
          // TODO: 提示用户不支持的后缀
          // notify(t(`only support pictures in ${supportExtends.join(',')} format`));
          setAvatarErrorMsg(i18n._(t`only support pictures in ${supportExtends.join(',')} format`))
          setAvatarError(true)
          return
        } else {
          setAvatarError(false)
        }
        //console.log('select file', file);
        // setState({ ...state, 'file': file });
        // const filename = `File '${file.name}' was selected`

        if (e.target.name === 'avatar_file') {
          let fr = new FileReader()
          fr.onloadend = function (e: any) {
            setState({ ...state, avatar_base64: e.target.result, avatar_file: file })
          }
          fr.readAsDataURL(file)
        }
        if (e.target.name === 'banner_file') {
          let fr = new FileReader()
          fr.onloadend = function (e: any) {
            setState({ ...state, banner_base64: e.target.result, banner_file: file })
          }
          fr.readAsDataURL(file)
        }
      }
    } else {
      setState((oldValue) => ({ ...oldValue, [e.target.name]: e.target.value }))
    }
  }

  async function handleConfirm() {
    if (state.username === '') {
      console.info('confirm')
      // TODO: 提示用户输入不能为空
      // notify(t('please fill the text'));
      setUserNameError(true)
      addPopup({
        alert: {
          message: userNameErrorMsg,
          success: false,
        },
      })
      return
    } else {
      setUserNameError(false)
    }
    // TODO: 验证邮箱
    // if (!emailPattern(state.email)) {
    //     notify(t('please enter a real email'))
    //     return
    // }
    if (state.avatar_file) {
      console.log('get file size:', state.avatar_file.size)
      const maxsize = 50
      if (state.avatar_file.size > 1024 * 1024 * maxsize) {
        // TODO: 提示用户图片太大
        // notify(t('image is too large, less then TT').replace('TT', '5M'));
        setAvatarErrorMsg(i18n._(t`image is too large, less then TT`.replace('TT', '5M')))
        setAvatarError(true)
        addPopup({
          alert: {
            message: i18n._(t`image is too large, less then TT`.replace('TT', '5M')),
            success: false,
          },
        })
        return
      } else {
        setAvatarError(false)
      }
    }
    if (state.banner_file) {
      console.log('get file size:', state.banner_file.size)
      const maxsize = 50
      if (state.banner_file.size > 1024 * 1024 * maxsize) {
        // TODO: 提示用户图片太大
        // notify(t('image is too large, less then TT').replace('TT', '5M'));
        setBannerErrorMsg(i18n._(t`image is too large, less then TT`.replace('TT', '5M')))
        setBannerError(true)
        addPopup({
          alert: {
            message: i18n._(t`image is too large, less then TT`.replace('TT', '5M')),
            success: false,
          },
        })
        return
      } else {
        setBannerError(false)
      }
    }
    // 设置loading状态
    setConfirmLoading(true)

    const formData = new FormData()
    if (state.avatar_file) {
      formData.append('avatar', state.avatar_file as Blob)
    }
    if (state.banner_file) {
      formData.append('banner', state.banner_file as Blob)
    }

    formData.append('account', account ? account : '')
    formData.append('username', state.username as string)
    formData.append('email', state.email)
    formData.append('bio', state.bio)

    console.info('formData', formData)

    const result = await updateProfile(formData)
    console.log('updateProfile result', result)
    if (result && result.statusCode && result.statusCode == 401) {
      addPopup({
        alert: {
          message: i18n._(t`please sign in with signature!`),
          success: false,
        },
      })
    } else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
      if (account) {
        mutate(profile(account))
      }
    }
    setConfirmLoading(false)

    // notify(t('Submit success'))
  }

  return (
    <>
      <NextSeo title={i18n._(t`Profile Settings`)} />
      <section className="container">
        <div className="max-w-4xl p-8 mx-auto">
          <Typography variant="h2">{i18n._(t`Profile Settings`)}</Typography>
          <div className="flex flex-col justify-between md:flex-row">
            <div className="w-full md:w-3/5">
              {/* username START */}
              <div className="w-full mt-8 form-control">
                <Typography variant="base" weight={700}>
                  {i18n._(t`username`)}
                </Typography>
                {userNameError ? (
                  <Typography variant="sm" className="text-error">
                    {userNameErrorMsg}
                  </Typography>
                ) : (
                  <></>
                )}
                <input
                  onChange={handleChange}
                  value={state.username}
                  name="username"
                  type="text"
                  placeholder="Type here"
                  className="w-full mt-2 input input-bordered input-primary"
                ></input>
              </div>
              {/* username END */}
              {/* bio START */}
              <div className="w-full mt-8 form-control">
                <label className="label">
                  <Typography variant="base" weight={700}>
                    {i18n._(t`bio`)}
                  </Typography>
                </label>
                <textarea
                  onChange={handleChange}
                  value={state.bio}
                  name="bio"
                  className="textarea textarea-primary"
                  placeholder="Bio"
                ></textarea>
              </div>
              {/* bio END */}
              {/* email START */}
              <div className="w-full mt-8 form-control">
                <label className="label">
                  <Typography variant="base" weight={700}>
                    {i18n._(t`email`)}
                  </Typography>
                </label>
                <input
                  onChange={handleChange}
                  value={state.email}
                  name="email"
                  type="text"
                  placeholder="Email"
                  className="w-full input input-bordered input-primary "
                ></input>
              </div>
              {/* email END */}
            </div>
            <div className="w-full mt-8 md:w-2/5 md:ml-16 sm:mt-8 md:mt-8 lg:mt-8 xl:mt-8">
              {/* avatar START */}
              <div className="w-full form-control ">
                <Typography variant="base" weight={700}>
                  {i18n._(t`avatar`)}
                </Typography>
                <div className="mt-4 avatar">
                  <div className="relative w-40 rounded-full cursor-pointer ">
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="avatar-file"
                      type="file"
                      name="avatar_file"
                      onChange={handleChange}
                    />
                    {!state.avatar_base64 && !state.avatar_url && <div className="w-full h-40 bg-base-300" />}
                    {state.avatar_base64 ? (
                      <Image width={160} height={160} layout="responsive" alt="avatar" src={state.avatar_base64} />
                    ) : (
                      // <img src={state.avatar_base64} alt="avatar" />
                      // state.avatar_url && <img src={state.avatar_url} alt="avatar" />
                      state.avatar_url && (
                        <Image width={160} height={160} layout="responsive" alt="avatar" src={state.avatar_url} />
                      )
                    )}
                    <label
                      htmlFor="avatar-file"
                      className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25 opacity-50 cursor-pointer text-primary hover:opacity-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
              {/* avatar END */}
              {/* banner START */}
              <div className="w-full mt-4 form-control">
                <Typography variant="base" weight={700}>
                  {i18n._(t`banner`)}
                </Typography>
                <div className="mt-4">
                  <div className="relative w-full h-32 cursor-pointer">
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="banner-file"
                      type="file"
                      name="banner_file"
                      onChange={handleChange}
                    />
                    {!state.banner_url && !state.banner_base64 && <div className="w-full h-32 bg-base-300" />}
                    {state.banner_base64 ? (
                      <Image layout="fill" className="object-cover" alt="banner" src={state.banner_base64} />
                    ) : (
                      // <img className="block w-full h-auto" src={state.banner_base64} alt="banner" />
                      // state.banner_url && <img className="block w-full h-auto" src={state.banner_url} alt="banner" />
                      state.banner_url && (
                        <Image layout="fill" className="object-cover" alt="banner" src={state.banner_url} />
                      )
                    )}
                    <label
                      htmlFor="banner-file"
                      className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25 opacity-50 cursor-pointer text-primary hover:opacity-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
              {/* banner END */}
            </div>
          </div>
          <div className="flex flex-row items-center py-8">
            <Button
              onClick={() => {
                handleConfirm().catch(() => setConfirmLoading(false))
              }}
              disabled={confirmLoading}
              loading={confirmLoading}
              color="primary"
              className="w-52"
            >
              {i18n._(t`Save`)}
            </Button>
            {userNameError || emailError || avatarError || bannerError ? (
              <Typography variant="sm" className="ml-4 text-error">
                {errorMsg}
              </Typography>
            ) : (
              <></>
            )}
            {success ? (
              <Typography variant="sm" className="ml-4 text-info">
                {successMsg}
              </Typography>
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
Settings.Guard = SignGuard(false)
export default Settings
