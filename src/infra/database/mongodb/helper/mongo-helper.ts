import { Collection, MongoClient } from 'mongodb'
import { Collections } from './protocols/mongo-collections-protocol'

export const MongoHelper = {
  client: MongoClient,
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: Collections): Collection {
    return this.client.db().collection(name)
  }
}
