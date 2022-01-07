import { MustLoginError } from '@/application/errors'

describe('mustLoginError', () => {
  it('should be an instance of Error', () => {
    const sut = new MustLoginError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new MustLoginError()

    const result = sut.message

    expect(result).toBe('Você deve fazer o login primeiro')
  })
})
