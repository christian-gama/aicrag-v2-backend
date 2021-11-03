import { getPeriod } from '@/infra/database/helpers'
import MockDate from 'mockdate'

describe('getPeriod', () => {
  afterEach(() => {
    MockDate.reset()
  })

  it('should return only date and month filter is period is undefined', () => {
    const result = getPeriod('1', '2020', undefined)

    expect(result).toStrictEqual([{ 'date.month': { $eq: 1 } }, { 'date.year': { $eq: 2020 } }])
  })

  it('should a filter with the day if period is today', () => {
    MockDate.set(new Date('2021-01-01T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'today')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $eq: new Date().getUTCDate() } }
    ])
  })

  it('should a filter with the day if period is past_3_days', () => {
    MockDate.set(new Date('2021-01-04T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'past_3_days')
    const today = new Date().getUTCDate()
    const past3days = today - 2 < 1 ? 1 : today - 2

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: past3days, $lte: new Date().getUTCDate() } }
    ])
  })

  it('should a filter with the day if period is past_7_days', () => {
    MockDate.set(new Date('2021-01-08T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'past_7_days')
    const today = new Date().getUTCDate()
    const past7days = today - 6 < 1 ? 1 : today - 6

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: past7days, $lte: new Date().getUTCDate() } }
    ])
  })

  it('should a filter with the day if period is past_15_days', () => {
    MockDate.set(new Date('2021-01-16T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'past_15_days')
    const today = new Date().getUTCDate()
    const past15days = today - 14 < 1 ? 1 : today - 14

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: past15days, $lte: new Date().getUTCDate() } }
    ])
  })

  it('should return day 1 if the difference of days is lesser than 1 when period is past_3_days', () => {
    MockDate.set(new Date('2021-01-01T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'past_7_days')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: 1, $lte: new Date().getUTCDate() } }
    ])
  })

  it('should return day 1 if the difference of days is lesser than 1 when period is past_7_days', () => {
    MockDate.set(new Date('2021-01-01T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'past_7_days')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: 1, $lte: new Date().getUTCDate() } }
    ])
  })

  it('should return day 1 if the difference of days is lesser than 1', () => {
    MockDate.set(new Date('2021-01-01T00:00:00.000Z'))

    const result = getPeriod('1', '2020', 'past_15_days')

    expect(result).toStrictEqual([
      { 'date.month': { $eq: 1 } },
      { 'date.year': { $eq: 2020 } },
      { 'date.day': { $gte: 1, $lte: new Date().getUTCDate() } }
    ])
  })
})
