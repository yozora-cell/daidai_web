export function getCookie(name: string): string {
  if (document.cookie.length === 0) {
    return ''
  }
  let start = document.cookie.indexOf(`${name}=`)
  if (start === -1) {
    return ''
  }

  start = start + name.length + 1
  let end = document.cookie.indexOf(';', start)
  if (end === -1) end = document.cookie.length
  return unescape(document.cookie.substring(start, end))
}
