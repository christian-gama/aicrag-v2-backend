/* eslint-disable sort-keys */
import { MongoAdapter } from '../../infra/adapters/database/mongodb'

export const CreateLogSchema = async (): Promise<any> => {
  await MongoAdapter.client
    .db()
    .listCollections({ name: 'logs' })
    .next(async (err: Error, collInfo: any) => {
      if (err) console.log(err)
      if (!collInfo) {
        try {
          await MongoAdapter.client.db().createCollection('logs', {
            validator: {
              $jsonSchema: {
                bsonType: 'object',
                required: ['date', 'message', 'name', 'stack'],
                properties: {
                  date: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  message: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  name: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  stack: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  }
                }
              }
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    })
}
