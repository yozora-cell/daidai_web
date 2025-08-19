import { Fragment } from "react"

const AutoLink = ({
    text
}:{
    text: string
}) => {
  const delimiter =
    /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/gi

  return (
    <Fragment>
      {text.split(delimiter).map((word: string) => {
        let match = word.match(delimiter)
        if (match) {
          let url = match[0]
          let isEndWithDot = false
          if (url.endsWith('.')) {
            url = url.substring(0, url.length - 1)
            isEndWithDot = true
          }
          const render = (
            <a
              href={(url.startsWith('https') || url.startsWith('http')) ? url :  `https://${url}`}
              target="_blank"
              rel="noreferrer"
              className="underline text-info"
            >
              {url}
            </a>
          )
          if (isEndWithDot) {
            return <>{render}.</>
          } else {
            return render
          }
        }
        return word
      })}
    </Fragment>
  )
}

export default AutoLink
