import {
  ICollection,
  DatabaseProtocol,
  CollectionsName,
  CollectionProtocol
} from '../../database/protocols'

import { MongoClient } from 'mongodb'

export class MongoAdapter extends ICollection implements DatabaseProtocol {
  static client: any = null

  collection (name: CollectionsName): CollectionProtocol {
    if (!MongoAdapter.client) throw new Error('Database is not connected')

    this._collection = MongoAdapter.client.db().collection(name)

    return {
      deleteMany: this.deleteMany.bind(this),
      deleteOne: this.deleteOne.bind(this),
      findOne: this.findOne.bind(this),
      insertOne: this.insertOne.bind(this),
      updateOne: this.updateOne.bind(this)
    }
  }

  async disconnect (): Promise<void> {
    if (MongoAdapter.client) {
      await MongoAdapter.client.close()

      MongoAdapter.client = null
    } else {
      throw new Error('Database is not connected')
    }
  }

  static async connect (url: string): Promise<void> {
    MongoAdapter.client = await MongoClient.connect(url)
  }
}
