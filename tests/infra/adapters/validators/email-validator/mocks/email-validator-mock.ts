import { EmailValidatorAdapter, EmailValidatorProtocol } from '@/infra/adapters/validators/email-validator/'

export const makeSut = (): EmailValidatorProtocol => {
  const sut = new EmailValidatorAdapter()

  return sut
}
