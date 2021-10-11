export const getType = (type: 'QA' | 'TX' | 'both'): 'QA' | 'TX' | { $ne: null } => {
  if (type === 'both') return { $ne: null }

  return type
}
