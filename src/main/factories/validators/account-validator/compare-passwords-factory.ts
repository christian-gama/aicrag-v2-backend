import { ComparePasswords } from '@/application/usecases/validators/account'

export const makeComparePasswords = (): ComparePasswords => {
  return new ComparePasswords()
}
