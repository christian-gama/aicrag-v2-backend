import { MongoAdapter } from '@/infra/adapters/database/mongodb'

import { LogSchema } from './log-schema'
import { TaskSchema } from './task-schema'
import { UserSchema } from './user-schema'

const createSchema = async (collection: string, schema: Record<string, any>): Promise<any> => {
  await MongoAdapter.client
    .db()
    .listCollections({ name: collection })
    .next(async (err: Error, collInfo: any) => {
      if (err) console.log(err)
      if (!collInfo) {
        try {
          await MongoAdapter.client.db().createCollection(collection, schema)
        } catch (err) {
          console.log(err)
        }
      }
    })
}

export const createSchemas = async (): Promise<void> => {
  await createSchema('logs', LogSchema)
  await createSchema('tasks', TaskSchema)
  await createSchema('users', UserSchema)
}
