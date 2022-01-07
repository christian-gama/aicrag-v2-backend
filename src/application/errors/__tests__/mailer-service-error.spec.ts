import { MailerServiceError } from '@/application/errors'

describe('mailerServiceError', () => {
  it('should be an instance of Error', () => {
    const sut = new MailerServiceError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new MailerServiceError()

    const result = sut.message

    expect(result).toBe('Não foi possível enviar o email')
  })
})
