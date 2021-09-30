import { ILogError } from '@/domain'
import { LogErrorDbRepositoryProtocol } from '@/domain/repositories'

import { DatabaseProtocol } from '@/infra/database/protocols'
import { UserDbFilter } from '@/infra/database/protocols/update-user-options'

import { FindOptions } from 'mongodb'

export class ClearUserDatabase {
  constructor (private readonly database: DatabaseProtocol, private readonly logErrorDbRepository: LogErrorDbRepositoryProtocol) {}

  async deleteInactiveUsers (): Promise<number | ILogError> {
    try {
      console.log(`[${new Date(Date.now()).toLocaleString()}] ClearUserDatabase: Looking for inactive users...`)

      const userCollection = this.database.collection('users')

      const filter: UserDbFilter | FindOptions = {
        'logs.createdAt': { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } as any,
        'settings.accountActivated': false
      }

      const deletedCount = await userCollection.deleteMany(filter)

      if (deletedCount > 0) {
        console.log(`[${new Date(Date.now()).toLocaleString()}] ClearUserDatabase: ${deletedCount} inactive users were deleted.`)
      }

      return deletedCount
    } catch (error) {
      return await this.logErrorDbRepository.saveLog(error)
    }
  }
}
