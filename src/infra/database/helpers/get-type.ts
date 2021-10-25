export const getType = (type: 'QA' | 'TX' | 'both'): 'QA' | 'TX' | { $ne: null } => {
  let result: any = type

  if (type === 'both') result = { $ne: null }

  return result
}
