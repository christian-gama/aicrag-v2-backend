import { AccountMongoRepository } from '@/infra/database/mongodb/account/account-mongo-repository'
import { makeAccountRepository } from '../account-repository/account-repository-factory'

export const makeAccountMongoRepository = (): AccountMongoRepository => {
  const accountRepository = makeAccountRepository()

  return new AccountMongoRepository(accountRepository)
}
