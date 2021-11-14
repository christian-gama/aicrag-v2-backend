import { ValidateAccountStatus } from '@/application/validators/user'

export const makeValidateAccountStatus = (): ValidateAccountStatus => {
  return new ValidateAccountStatus()
}
