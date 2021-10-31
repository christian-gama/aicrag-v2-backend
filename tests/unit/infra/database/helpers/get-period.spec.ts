import { getPeriod } from '@/infra/database/helpers/get-period'

describe('getPeriod', () => {
  it('should return date from month and year if period is undefined', () => {
    const result = getPeriod('1', '2020', undefined)

    expect(result).toStrictEqual([{ 'date.month': { $eq: 1 } }, { 'date.year': { $eq: 2020 } }])
  })

  it('should return date from month and year if period is today', () => {
    const result = getPeriod('1', '2020', 'today')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $eq: new Date().getDate() } }
    ])
  })

  it('should return date from month and year if period is past_3_days', () => {
    const result = getPeriod('1', '2020', 'past_3_days')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: new Date().getDate() - 2, $lte: new Date().getDate() } }
    ])
  })

  it('should return date from month and year if period is past_7_days', () => {
    const result = getPeriod('1', '2020', 'past_7_days')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: new Date().getDate() - 6, $lte: new Date().getDate() } }
    ])
  })

  it('should return date from month and year if period is past_15_days', () => {
    const result = getPeriod('1', '2020', 'past_15_days')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: new Date().getDate() - 14, $lte: new Date().getDate() } }
    ])
  })
})
