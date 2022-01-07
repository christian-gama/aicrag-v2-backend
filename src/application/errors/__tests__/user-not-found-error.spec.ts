import { UserNotFoundError } from '@/application/errors'

describe('taskNotFoundError', () => {
  it('should be an instance of Error', () => {
    const sut = new UserNotFoundError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new UserNotFoundError()

    const result = sut.message

    expect(result).toBe('Não foi possível encontrar usuários')
  })
})
