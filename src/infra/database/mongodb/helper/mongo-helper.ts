import { Collection, MongoClient } from 'mongodb'
import { Collections } from './protocols/mongo-collections-protocol'

export const MongoHelper = {
  async connect (url: string): Promise<void> {
    this.url = url

    this.client = this.client ?? await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client?.close()

    this.client = null
  },

  async getCollection (name: Collections): Promise<Collection> {
    await this.connect(this.url)

    return this.client.db().collection(name)
  }
}
