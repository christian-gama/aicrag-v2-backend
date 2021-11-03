import { CreateLogErrorRepository } from '@/application/repositories'
import MockDate from 'mockdate'

interface SutTypes {
  sut: CreateLogErrorRepository
}

const makeSut = (): SutTypes => {
  const sut = new CreateLogErrorRepository()

  return { sut }
}

describe('createLogErrorRepository', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return a ILogError', () => {
    const { sut } = makeSut()
    const error = new Error('any_message')

    const result = sut.create(error)

    expect(result).toStrictEqual({
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      name: error.name,
      stack: error.stack
    })
  })
})
