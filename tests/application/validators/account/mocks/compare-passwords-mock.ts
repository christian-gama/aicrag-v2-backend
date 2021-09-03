import { Validation } from '@/application/validators/protocols/validation-protocol'
import { ComparePasswords } from '@/application/validators/account'

export const makeSut = (): Validation => {
  const sut = new ComparePasswords()

  return sut
}
