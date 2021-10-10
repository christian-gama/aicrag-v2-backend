import {
  QueryMethodsProtocol,
  QueryProtocol,
  QueryResultProtocol
} from '@/infra/database/protocols/queries-protocol'

import {
  CollectionProtocol,
  CollectionsName,
  DatabaseProtocol,
  Document,
  ICollection
} from '../../../database/protocols'

import { MongoClient } from 'mongodb'

export class MongoAdapter extends ICollection implements DatabaseProtocol {
  protected _collection: any
  static client: any = null

  constructor (private readonly queries: QueryMethodsProtocol) {
    super()
  }

  collection (name: CollectionsName): CollectionProtocol {
    if (!MongoAdapter.client) throw new Error('Database is not connected')

    this._collection = MongoAdapter.client.db().collection(name)

    /* Ensure collection return methods bound to a new instance of MongoAdapter
    to avoid replacing this._collection if use multiple collections */
    const mongoAdapter = new MongoAdapter(this.queries)
    mongoAdapter._collection = this._collection

    return {
      aggregate: this.aggregate.bind(mongoAdapter),
      deleteMany: this.deleteMany.bind(mongoAdapter),
      deleteOne: this.deleteOne.bind(mongoAdapter),
      findAll: this.findAll.bind(mongoAdapter),
      findOne: this.findOne.bind(mongoAdapter),
      insertOne: this.insertOne.bind(mongoAdapter),
      updateOne: this.updateOne.bind(mongoAdapter)
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

  protected async aggregate<T>(
    pipeline: Document[],
    query: QueryProtocol
  ): Promise<QueryResultProtocol<T>> {
    const limit = this.queries.limit(query)
    const skip = this.queries.page(query)

    pipeline.push({ $count: 'totalCount' })
    const totalCount = await this._collection.aggregate(pipeline).toArray()
    const count = totalCount.length > 0 ? totalCount[0].totalCount : 0
    pipeline.pop()

    if (query.sort) {
      const sort = this.queries.sort(query)
      pipeline.push({ $sort: sort })
    }
    const documents = await this._collection.aggregate(pipeline).limit(limit).skip(skip).toArray()

    const currentPage = skip / limit + 1
    const totalPages = Math.ceil(count / limit)

    return { count, currentPage, documents, totalPages }
  }

  protected async deleteMany (filter: Document): Promise<number> {
    const deleted = await this._collection.deleteMany(filter)

    return deleted.deletedCount
  }

  protected async deleteOne (filter: Document): Promise<boolean> {
    const deleted = await this._collection.deleteOne(filter)

    if (deleted.deletedCount > 0) return true
    else return false
  }

  protected async findAll<T extends Document>(
    filter: Document,
    query: QueryProtocol
  ): Promise<QueryResultProtocol<T>> {
    const fields = this.queries.fields(query)
    const limit = this.queries.limit(query)
    const skip = this.queries.page(query)
    const sort = this.queries.sort(query)

    const cursor = this._collection.find(filter, { projection: fields })

    const count = await cursor.count()
    const documents = await cursor.limit(limit).skip(skip).sort(sort).toArray()

    const currentPage = skip / limit + 1
    const totalPages = Math.ceil(count / limit)

    return { count, currentPage, documents, totalPages }
  }

  protected async findOne<T extends Document>(filter: Document): Promise<T | null> {
    const foundDoc = await this._collection.findOne(filter)

    if (foundDoc) return foundDoc as T
    else return null
  }

  protected async insertOne<T extends Document>(doc: Document): Promise<T> {
    await this._collection.insertOne(doc)

    const insertedDoc = await this._collection.findOne(doc)

    return insertedDoc
  }

  protected async updateOne<T extends Document>(
    filter: Document,
    update: Document
  ): Promise<T | null> {
    await this._collection.updateOne(filter, { $set: update })

    const updatedDoc = await this._collection.findOne(update)

    return updatedDoc
  }

  static async connect (url: string): Promise<void> {
    MongoAdapter.client = await MongoClient.connect(url)
  }
}
