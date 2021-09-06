import { EmailValidator } from '@/application/protocols/validators/email-validator/email-validator-protocol'
import { EmailValidatorAdapter } from '@/infra/adapters/validators/email-validator/email-validator-adapter'

export const makeSut = (): EmailValidator => {
  const sut = new EmailValidatorAdapter()

  return sut
}
