import { LogErrorRepository } from '@/application/repositories'

interface SutTypes {
  sut: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogErrorRepository()

  return { sut }
}

describe('logErrorRepository', () => {
  it('should return a ILogError', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const error = new Error('any_message')

    const value = sut.createLog(error)

    expect(new Date(value.date).getTime()).not.toBe(NaN)
    expect(value.message).toBe(error.message)
    expect(value.name).toBe(error.name)
    expect(value.stack).toBe(error.stack)
  })
})
