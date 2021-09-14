import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { LogErrorProtocol } from '@/domain/log/log-error-protocol'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'
import { FindOptions } from 'mongodb'
import { makeLogErrorDbRepository } from '../factories/repositories/log/log-error-db-repository/log-error-db-repository-factory'

export class ClearUserDatabase {
  constructor (private readonly logErrorDbRepository: LogErrorDbRepositoryProtocol) {}

  async deleteInactiveUsers (): Promise<number | LogErrorProtocol> {
    try {
      console.log('ClearUserDatabase: Looking for inactive users...')

      const userCollection = await MongoHelper.getCollection('users')

      const filter: UserDbFilter | FindOptions = {
        'settings.accountActivated': false,
        'logs.createdAt': { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } as any
      }

      const deleted = await userCollection.deleteMany(filter)

      if (deleted.deletedCount > 0) { console.log(`ClearUserDatabase: ${deleted.deletedCount} inactive users were deleted.`) }

      return deleted.deletedCount
    } catch (error) {
      return await this.logErrorDbRepository.saveLog(error)
    }
  }
}

const clearUserDatabase = new ClearUserDatabase(makeLogErrorDbRepository())

setInterval(async () => {
  await clearUserDatabase.deleteInactiveUsers()
}, 24 * 60 * 60 * 1000)
