interface Document {
  [key: string]: any
}

export interface CollectionProtocol {
  deleteMany: (doc: Document) => Promise<number>
  deleteOne: (doc: Document) => Promise<boolean>
  findOne: <T extends Document>(doc: Document) => Promise<T | null>
  insertOne: <T extends Document>(doc: Document) => Promise<T>
  updateOne: <T extends Document>(doc: Document, update: Document) => Promise<T | null>
}

export interface DbClientProtocol {
  collection: (name: string) => CollectionProtocol
  disconnect: () => Promise<void>
}

export interface DatabaseProtocol {
  collection: (name: CollectionsName) => CollectionProtocol
  disconnect: () => Promise<void>
}

export abstract class ICollection {
  protected _collection: any

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

  protected async updateOne<T extends Document>(doc: Document, update: Document): Promise<T | null> {
    await this._collection.updateOne(doc, { $set: update })

    const updatedDoc = await this._collection.findOne(update)

    return updatedDoc
  }
}

export type CollectionsName = 'logs' | 'users'
