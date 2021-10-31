export const getPeriod = (month, year, period): Record<string, any> | null => {
  const result: any = [{ 'date.month': { $eq: +month } }, { 'date.year': { $eq: +year } }]
  const today = new Date().getDate()
  let past3days = today - 2
  let past7days = today - 6
  let past15days = today - 14

  // Make sure the period is not lesser than 1
  while (past3days < 1) {
    past3days += 1
  }

  while (past7days < 1) {
    past7days += 1
  }

  while (past15days < 1) {
    past15days += 1
  }

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
