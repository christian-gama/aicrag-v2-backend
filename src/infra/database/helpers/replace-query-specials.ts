export const replaceQuerySpecials = (queryStr: string): string => {
  queryStr = queryStr.split(' ').join('+')
  queryStr = queryStr.replace(/\+/g, '\\+')
  queryStr = queryStr.replace(/:/g, '\\:')
  queryStr = queryStr.replace(/=/g, '\\=')
  queryStr = queryStr.replace(/-/g, '\\-')
  queryStr = queryStr.replace(/\./g, '\\.')
  queryStr = queryStr.replace(/,/g, '\\,')
  queryStr = queryStr.replace(/\?/g, '\\=')
  queryStr = queryStr.replace(/\$/g, '\\$')
  queryStr = queryStr.replace(/@/g, '\\@')
  queryStr = queryStr.replace(/!/g, '\\!')
  queryStr = queryStr.replace(/#/g, '\\#')
  queryStr = queryStr.replace(/%/g, '\\%')

  return queryStr
}
