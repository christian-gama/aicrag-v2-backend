import { AccountDbRepository } from '@/infra/database/mongodb/account/account-db-repository'
import { makeAccountRepository } from '../account-repository/account-repository-factory'

export const makeAccountMongoRepository = (): AccountDbRepository => {
  const accountRepository = makeAccountRepository()

  return new AccountDbRepository(accountRepository)
}
