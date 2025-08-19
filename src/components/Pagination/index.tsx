import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon, DotsHorizontalIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { FC, ReactNode, useCallback } from 'react'

interface PaginationProps {
  currentPage: number
  onChange: (page: number) => void
  totalPages: number
  pageNeighbours: number
  canNextPage: boolean
  canPreviousPage: boolean
}

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
// @ts-ignore TYPE NEEDS FIXING
const range = (from, to, step = 1): (string | number)[] => {
  let i = from
  const range: (string | number)[] = []

  while (i <= to) {
    range.push(i)
    i += step
  }

  return range
}

const Pagination: FC<PaginationProps> = ({
  totalPages,
  onChange,
  currentPage,
  pageNeighbours,
  canNextPage,
  canPreviousPage,
}) => {
  const { i18n } = useLingui()
  const breakpoint = useBreakPointMediaQuery()

  const getPageNumbers = useCallback(() => {
    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = pageNeighbours * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours)
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours)
      let pages = range(startPage, endPage)

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2
      const hasRightSpill = totalPages - endPage > 1
      const spillOffset = totalNumbers - (pages.length + 1)

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1)
          pages = [LEFT_PAGE, ...extraPages, ...pages]
          break
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset)
          pages = [...pages, ...extraPages, RIGHT_PAGE]
          break
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE]
          break
        }
      }

      return [1, ...pages, totalPages]
    }

    return range(1, totalPages)
  }, [currentPage, pageNeighbours, totalPages])

  const pages = getPageNumbers().reduce<ReactNode[]>((acc, page, index) => {
    if (page === LEFT_PAGE)
      acc.push(
        <button className="btn btn-ghost btn-disabled" key={index}>
          <DotsHorizontalIcon width={12} className="text-base-content" />
        </button>
      )
    else if (page === RIGHT_PAGE)
      acc.push(
        <button className="btn btn-ghost btn-disabled" key={index}>
          <DotsHorizontalIcon width={12} className="text-base-content" />
        </button>
      )
    else
      acc.push(
        <button
          key={index}
          onClick={() => onChange((page as number) - 1)}
          className={classNames('btn', page === currentPage + 1 ? 'btn-primary' : 'btn-ghost')}
        >
          {page}
        </button>
      )

    return acc
  }, [])

  const pagesArray = range(1, totalPages)

  return totalPages > 1 ? (
    <nav className="flex flex-row items-center justify-between gap-2 sm:px-0">
      <div className="flex">
        {canPreviousPage && (
          <button onClick={() => onChange(currentPage - 1)} className={classNames('btn btn-primary btn-ghost')}>
            <span className="text-pink">
              <ArrowNarrowLeftIcon className="w-5 h-5 mr-3" aria-hidden="true" />
            </span>
            {i18n._(t`Previous`)}
          </button>
        )}
      </div>
      {breakpoint != BreakPoint.DEFAULT ? (
        <>
          <div className="md:flex">{pages}</div>
        </>
      ) : (
        <>
          <select
            className={classNames('btn', 'btn-primary', 'select')}
            defaultValue={currentPage + 1}
            onChange={(event) => {
              // console.log('value', event.target.value)
              onChange(Number(event.target.value) - 1)
            }}
          >
            {pagesArray.map((curPage) => {
              return (
                <option value={curPage} key={curPage}>
                  {curPage}
                </option>
              )
            })}
          </select>
        </>
      )}
      <div className="flex items-center justify-end">
        {canNextPage && (
          <button onClick={() => onChange(currentPage + 1)} className={classNames('btn btn-primary btn-ghost')}>
            {i18n._(t`Next`)}
            <span className="text-pink-red">
              <ArrowNarrowRightIcon className="w-5 h-5 ml-3" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
    </nav>
  ) : (
    <></>
  )
}

export default Pagination
