import { IDateUtils } from '@/domain/helpers'
import { DateUtils } from '../date-utils'

interface SutTypes {
  sut: IDateUtils
}

const makeSut = (): SutTypes => {
  const sut = new DateUtils()

  return { sut }
}

describe('dateUtils', () => {
  it('should return the correct date', () => {
    const { sut } = makeSut()

    const date = sut.getUTCDate('2022-01-01T00:00:00.000-03:00')

    expect(date.getUTCFullYear()).toBe(2022)
    expect(date.getUTCMonth()).toBe(0)
    expect(date.getUTCDate()).toBe(1)
    expect(date.getUTCHours()).toBe(0)
    expect(date.getUTCMinutes()).toBe(0)
    expect(date.getUTCSeconds()).toBe(0)
    expect(date.getUTCMilliseconds()).toBe(0)
  })

  it('should return the correct date using ISOString', () => {
    const { sut } = makeSut()

    const date = sut.getUTCDate('2022-01-01T00:00:00.000-03:00')

    expect(date.getUTCFullYear()).toBe(2022)
    expect(date.getUTCMonth()).toBe(0)
    expect(date.getUTCDate()).toBe(1)
    expect(date.getUTCHours()).toBe(0)
    expect(date.getUTCMinutes()).toBe(0)
    expect(date.getUTCSeconds()).toBe(0)
    expect(date.getUTCMilliseconds()).toBe(0)
  })

  it('should return true if is same date string', () => {
    const { sut } = makeSut()

    const result = sut.isSameDateString('2022-01-01T00:00:00.000-03:00', '2022-01-01T00:00:00.000Z')

    expect(result).toBe(true)
  })

  it('should return false if is not same date string', () => {
    const { sut } = makeSut()

    const result = sut.isSameDateString('2022-01-01T00:00:00.000-03:00', '2022-01-01T00:00:00.001-03:00')

    expect(result).toBe(false)
  })
})
