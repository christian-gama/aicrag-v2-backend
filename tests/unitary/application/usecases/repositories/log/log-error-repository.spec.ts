import { makeSut } from './log-error-repository-sut'

describe('LogErrorRepository', () => {
  it('Should return a ILogError', () => {
    const { sut } = makeSut()
    const error = new Error('any_message')

    const value = sut.createLog(error)

    expect(value.name).toBe(error.name)
    expect(new Date(value.date).getTime()).not.toBe(NaN)
    expect(value.message).toBe(error.message)
    expect(value.stack).toBe(error.stack)
  })
})
