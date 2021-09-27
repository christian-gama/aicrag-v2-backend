import {
  CollectionProtocol,
  CollectionsName,
  DatabaseProtocol,
  Document,
  ICollection
} from '../../database/protocols'

import { MongoClient } from 'mongodb'

export class MongoAdapter extends ICollection implements DatabaseProtocol {
  protected _collection: any
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

  protected async deleteMany (doc: Document): Promise<number> {
    const deleted = await this._collection.deleteMany(doc)

    if (deleted) return deleted.deletedCount
    else return 0
  }

  protected async deleteOne (doc: Document): Promise<boolean> {
    const deleted = await this._collection.deleteOne(doc)

    if (deleted.deletedCount > 0) return true
    else return false
  }

  protected async findOne<T extends Document>(doc: Document): Promise<T | null> {
    const foundDoc = await this._collection.findOne(doc)

    return foundDoc
  }

  protected async insertOne<T extends Document>(doc: Document): Promise<T> {
    await this._collection.insertOne(doc)

    const insertedDoc = await this._collection.findOne(doc)

    return insertedDoc
  }

  protected async updateOne<T extends Document>(
    doc: Document,
    update: Document
  ): Promise<T | null> {
    await this._collection.updateOne(doc, { $set: update })

    const updatedDoc = await this._collection.findOne(update)

    return updatedDoc
  }

  static async connect (url: string): Promise<void> {
    MongoAdapter.client = await MongoClient.connect(url)
  }
}
