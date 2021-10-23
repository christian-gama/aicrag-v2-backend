import { ILogError } from '@/domain'
import { ILogErrorRepository } from '@/domain/repositories'

import { IDatabase } from '@/infra/database/protocols'
import { IUserDbFilter } from '@/infra/database/protocols/update-user-options'

import { FindOptions } from 'mongodb'

export class ClearUserDatabase {
  constructor (private readonly database: IDatabase, private readonly logErrorRepository: ILogErrorRepository) {}

  async deleteInactiveUsers (): Promise<number | ILogError> {
    try {
      console.log(
        `[${new Date().toLocaleString('pt-br', {
          timeZone: 'America/Sao_Paulo'
        })}] ClearUserDatabase: Looking for inactive users...`
      )

      const userCollection = this.database.collection('users')

      const filter: IUserDbFilter | FindOptions = {
        'logs.createdAt': { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } as any,
        'settings.accountActivated': false
      }

      const deletedCount = await userCollection.deleteMany(filter)

      if (deletedCount > 0) {
        console.log(
          `[${new Date().toLocaleString('pt-br', {
            timeZone: 'America/Sao_Paulo'
          })}] ClearUserDatabase: ${deletedCount} inactive users were deleted.`
        )
      }

      return deletedCount
    } catch (error) {
      return await this.logErrorRepository.saveLog(error)
    }
  }
}
