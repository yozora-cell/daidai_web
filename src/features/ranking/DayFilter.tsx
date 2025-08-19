import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from 'app/functions'
import { Daytype } from 'app/types/daidai'
import { Fragment, useState } from 'react'

const DayFilter = ({
  onChangeDayType,
  defaultDayType,
}: {
  onChangeDayType: (dayType: Daytype) => void
  defaultDayType: Daytype
}) => {
  const { i18n } = useLingui()
  const dayTypeList = [Daytype.total, Daytype.oneDay, Daytype.sevenDay, Daytype.thirtyDay]
  const [daytype, setDaytype] = useState(defaultDayType)
  const getDayTypeText = (curDaytype: Daytype) => {
    switch (curDaytype) {
      case Daytype.oneDay:
        return i18n._(t`1 day`)
      case Daytype.sevenDay:
        return i18n._(t`7 days`)
      case Daytype.thirtyDay:
        return i18n._(t`30 days`)
      case Daytype.total:
        return i18n._(t`All`)
    }
  }

  return (
    <>
      <div className="flex flex-row gap-4">
        {dayTypeList.map((item, index) => (
          <button
            key={`${item}/${index}/daytype`}
            className={classNames('btn btn-primary btn-sm', daytype == item ? 'btn-active' : 'btn-outline')}
            value={item}
            onClick={() => {
              setDaytype(item)
              onChangeDayType(item)
            }}
          >
            {getDayTypeText(item)}
          </button>
        ))}
      </div>
    </>
  )
}

export default DayFilter
