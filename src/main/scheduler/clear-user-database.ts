import { ILogError } from '@/domain'

import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UserDbFilter } from '@/infra/database/mongodb/protocols/update-user-options'

import { FindOptions } from 'mongodb'

export class ClearUserDatabase {
  constructor (private readonly logErrorDbRepository: LogErrorDbRepositoryProtocol) {}

  async deleteInactiveUsers (): Promise<number | ILogError> {
    try {
      console.log(`[${new Date(Date.now()).toLocaleString()}] ClearUserDatabase: Looking for inactive users...`)

      const userCollection = MongoHelper.getCollection('users')

      const filter: UserDbFilter | FindOptions = {
        'logs.createdAt': { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } as any,
        'settings.accountActivated': false
      }

      const deleted = await userCollection.deleteMany(filter)

      if (deleted.deletedCount > 0) {
        console.log(`[${new Date(Date.now()).toLocaleString()}] ClearUserDatabase: ${deleted.deletedCount} inactive users were deleted.`)
      }

      return deleted.deletedCount
    } catch (error) {
      return await this.logErrorDbRepository.saveLog(error)
    }
  }
}
