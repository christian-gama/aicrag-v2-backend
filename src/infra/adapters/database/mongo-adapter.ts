import { Collections } from '../../database/protocols'

import { Collection, MongoClient } from 'mongodb'

export const MongoAdapter = {
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
