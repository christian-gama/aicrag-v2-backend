export const replaceQuerySpecials = (query: string): string => {
  let result = query

  result = result.split(' ').join('+')
  result = result.replace(/\+/g, '\\+')
  result = result.replace(/:/g, '\\:')
  result = result.replace(/=/g, '\\=')
  result = result.replace(/-/g, '\\-')
  result = result.replace(/\./g, '\\.')
  result = result.replace(/,/g, '\\,')
  result = result.replace(/\?/g, '\\=')
  result = result.replace(/\$/g, '\\$')
  result = result.replace(/@/g, '\\@')
  result = result.replace(/!/g, '\\!')
  result = result.replace(/#/g, '\\#')
  result = result.replace(/%/g, '\\%')

  return result
}
