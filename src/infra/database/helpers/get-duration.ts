export const getDuration = (
  duration: number = 30,
  operator: 'gte' | 'lte' | 'eq' = 'lte'
): { [key: string]: number } => {
  const result = { [`$${operator}`]: duration }

  return result
}
