import { MailerServiceError } from '@/application/errors'

describe('mailerServiceError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new MailerServiceError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new MailerServiceError()

    const result = sut.message

    expect(result).toBe('Could not send the email')
  })
})
