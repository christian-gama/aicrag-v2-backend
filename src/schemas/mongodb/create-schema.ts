import { MongoAdapter } from '@/infra/adapters/database/mongodb'

export const createSchema = async (collection: string, schema: Record<string, any>): Promise<any> => {
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
