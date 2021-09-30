export interface Document {
  [key: string]: any
}

export interface CollectionProtocol {
  deleteMany: (filter: Document) => Promise<number>
  deleteOne: (filter: Document) => Promise<boolean>
  findOne: <T extends Document>(filter: Document) => Promise<T | null>
  insertOne: <T extends Document>(doc: Document) => Promise<T>
  updateOne: <T extends Document>(filter: Document, update: Document) => Promise<T | null>
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

  protected abstract deleteMany (doc: Document): Promise<number>

  protected abstract deleteOne (doc: Document): Promise<boolean>

  protected abstract findOne<T extends Document>(doc: Document): Promise<T | null>

  protected abstract insertOne<T extends Document>(doc: Document): Promise<T>

  protected abstract updateOne<T extends Document>(
    doc: Document,
    update: Document
  ): Promise<T | null>
}

export type CollectionsName = 'logs' | 'users'