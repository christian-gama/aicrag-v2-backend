import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'
import { FindOptions } from 'mongodb'

export class ClearUserDatabase {
  async deleteInactiveUsers (): Promise<number> {
    const userCollection = await MongoHelper.getCollection('users')

    const filter: UserDbFilter | FindOptions = {
      'settings.accountActivated': false,
      'logs.createdAt': { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } as any
    }

    const deleted = await userCollection.deleteMany(filter)

    return deleted.deletedCount
  }
}
