import { ValidatePasswordMatch } from '@/application/usecases/validators/credentials-validator'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeBcryptAdapter } from '@/main/factories/cryptography/bcrypt-adapter-factory'

export const makeValidatePasswordMatch = (): ValidatePasswordMatch => {
  const userDbRepository = makeUserDbRepository()
  const hasher = makeBcryptAdapter()

  return new ValidatePasswordMatch(userDbRepository, hasher)
}
