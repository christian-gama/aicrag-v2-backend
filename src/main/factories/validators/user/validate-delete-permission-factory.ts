import { ValidateDeletePermission } from '@/application/validators/user'
import { makeUserRepository } from '../../repositories'

export const makeValidateDeletePermission = (): ValidateDeletePermission => {
  const userRepository = makeUserRepository()

  return new ValidateDeletePermission(userRepository)
}
