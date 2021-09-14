import { EmailValidatorAdapter } from '@/infra/adapters/validators/email-validator/'

interface SutTypes {
  sut: EmailValidatorAdapter
}

export const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()

  return { sut }
}
