import { AccountValidator } from '@/application/validators/account-validator'

interface SutTypes {
  sut: AccountValidator
}

export const makeSut = (): SutTypes => {
  const sut = new AccountValidator()

  return { sut }
}
