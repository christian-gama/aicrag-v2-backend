import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client?.close()

    this.client = null
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
