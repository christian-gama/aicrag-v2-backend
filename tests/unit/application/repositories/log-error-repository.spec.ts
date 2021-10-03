import { LogErrorRepository } from '@/application/repositories'

import MockDate from 'mockdate'

interface SutTypes {
  sut: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogErrorRepository()

  return { sut }
}

describe('logErrorRepository', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return a ILogError', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const error = new Error('any_message')

    const value = sut.createLog(error)

    expect(value).toStrictEqual({
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      name: error.name,
      stack: error.stack
    })
  })
})
