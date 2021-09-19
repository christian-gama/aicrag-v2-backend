import { makeSut } from './log-error-repository-sut'

describe('LogErrorRepository', () => {
  it('Should return a ILogError', () => {
    const { sut } = makeSut()
    const error = new Error('any_message')

    const value = sut.createLog(error)

    expect(value).toEqual({
      name: error.name,
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      stack: error.stack
    })
  })
})
