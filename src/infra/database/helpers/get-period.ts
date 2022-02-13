export const getPeriod = (month, year, period): Record<string, any> | null => {
  const result: any = [{ 'date.month': { $eq: +month } }, { 'date.year': { $eq: +year } }]

  const brazilTime = new Date().toLocaleString('pt-br', {
    timeZone: 'America/Sao_Paulo'
  })

  const today = +brazilTime.split('/')[0]
  const past3days = today - 2 < 1 ? 1 : today - 2
  const past7days = today - 6 < 1 ? 1 : today - 6
  const past15days = today - 14 < 1 ? 1 : today - 14

  switch (period) {
    case 'today':
      result.push({ 'date.day': { $eq: today } })
      break
    case 'past_3_days':
      result.push({ 'date.day': { $gte: past3days, $lte: today } })
      break
    case 'past_7_days':
      result.push({ 'date.day': { $gte: past7days, $lte: today } })
      break
    case 'past_15_days':
      result.push({ 'date.day': { $gte: past15days, $lte: today } })
      break
  }

  return result
}
