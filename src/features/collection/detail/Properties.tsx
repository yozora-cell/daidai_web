import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { NFTDetail } from 'app/types/daidai'

export const Skeleton = () => {
  return (
    <div className="box-border w-full p-3 border rounded-md bg-base-100 border-base-300">
      <div className="w-full h-full animate-pulse">
        <div className="w-full h-10 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
        <div className="w-full h-10 mt-2 rounded bg-base-300"></div>
      </div>
    </div>
  )
}

const Desc = ({ data }: { data: NFTDetail }) => {
  const { i18n } = useLingui()
  return data ? (
    <div>
      <div tabIndex={1000} className="border collapse collapse-arrow rounded-box border-base-300 bg-base-100">
        <input type="checkbox" className="peer" defaultChecked={true} />
        <div className="collapse-title peer-checked:text-bold">
          <Typography variant="base" weight={700}>
            {i18n._(t`Properties`)}
          </Typography>
        </div>
        <div className="p-0 collapse-content">
          {data && data.attributes ? (
            <>
              {data.attributes.map((attr, index) => {
                return (
                  <div
                    className={classNames(
                      'flex items-center justify-between px-4 py-2',
                      data && data.attributes && index != data.attributes?.length - 1
                        ? 'border-b border-b-base-300'
                        : ''
                    )}
                    key={`properties/${data.id}/${data.image}/${data.contract}/${index}`}
                  >
                    <Typography variant="base" className="text-primary text-opacity-60">
                      {attr.trait_type}
                    </Typography>
                    <div className="flex flex-row items-center justify-end">
                      {attr.value && (String(attr.value).startsWith('http') || String(attr.value).startsWith('https')) ? (
                        <>
                          <a className="w-full" target={'_blank'} href={attr.value} rel="noreferrer">
                            <Typography className="text-primary max-w-[200px] truncate">{attr.value}</Typography>
                          </a>
                        </>
                      ) : (
                        <>
                          <Typography className="text-primary max-w-[200px] truncate">{attr.value}</Typography>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <>
              <NoData></NoData>
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Skeleton></Skeleton>
  )
}
export default Desc
