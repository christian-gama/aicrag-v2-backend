import { MailerServiceError } from '@/application/usecases/errors'

describe('MailerServiceError', () => {
  it('Should be an instance of Error', () => {
    const sut = new MailerServiceError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new MailerServiceError()

    expect(sut.message).toBe('Could not send the email')
  })
})
