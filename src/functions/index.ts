export * from './array'
export * from './bentobox'
export * from './block'
export * from './cloudinary'
export * from './contract'
export * from './convert'
export * from './cookie'
export * from './currency'
export * from './ens'
export * from './explorer'
export * from './feature'
export * from './filtering'
export * from './format'
export * from './gtag'
export * from './kashi'
export * from './list'
export * from './math'
// export * from './oracle'
export * from './parse'
export * from './prices'
export * from './rebase'
export * from './retry'
export * from './storage'
export * from './styling'
export * from './trade'
export * from './validate'

export function isImage(url: string): boolean {
  const PICTURE_EXPRESSION = /\.(png|jpe?g|gif|svg)(\?.*)?$/
  const picReg = new RegExp(PICTURE_EXPRESSION)
  return url !== '' && url !== null && url !== undefined && picReg.test(url)
}
