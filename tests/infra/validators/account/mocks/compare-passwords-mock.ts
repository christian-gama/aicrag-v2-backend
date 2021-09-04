import { ComparePasswords } from '@/infra/validators/account'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

export const makeSut = (): AccountValidator => {
  const sut = new ComparePasswords()

  return sut
}
