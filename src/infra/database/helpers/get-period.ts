export const getPeriod = (month, year, period): Record<string, any> | null => {
  const result: any = [{ 'date.month': { $eq: +month } }, { 'date.year': { $eq: +year } }]

  switch (period) {
    case 'today':
      result.push({ 'date.day': { $eq: new Date().getDate() } })
      break
    case 'past_3_days':
      result.push({ 'date.day': { $gte: new Date().getDate() - 2, $lte: new Date().getDate() } })
      break
    case 'past_7_days':
      result.push({ 'date.day': { $gte: new Date().getDate() - 6, $lte: new Date().getDate() } })
      break
    case 'past_15_days':
      result.push({ 'date.day': { $gte: new Date().getDate() - 14, $lte: new Date().getDate() } })
      break
  }

  return result
}
