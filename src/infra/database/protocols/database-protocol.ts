import { IQuery, IQueryResult } from './queries-protocol'

export interface Document {
  [key: string]: any
}

export interface ICollectionMethods {
  aggregate: <T>(pipeline: Document[], query: IQuery) => Promise<IQueryResult<T>>
  deleteMany: (filter: Document) => Promise<number>
  deleteOne: (filter: Document) => Promise<boolean>
  findAll: <T extends Document>(filter: Document, query: IQuery) => Promise<IQueryResult<T>>
  findOne: <T extends Document>(filter: Document) => Promise<T | null>
  insertOne: <T extends Document>(doc: Document) => Promise<T>
  updateOne: <T extends Document>(filter: Document, update: Document) => Promise<T | null>
}

export interface DbClientProtocol {
  collection: (name: string) => ICollectionMethods
  disconnect: () => Promise<void>
}

export interface IDatabase {
  collection: (name: CollectionsName) => ICollectionMethods
  disconnect: () => Promise<void>
}

export abstract class ICollection {
  protected _collection: any

  protected abstract aggregate<T>(pipeline: Document[], query: IQuery): Promise<IQueryResult<T>>

  protected abstract deleteMany (doc: Document): Promise<number>

  protected abstract deleteOne (doc: Document): Promise<boolean>

  protected abstract findAll<T extends Document>(filter: Document, query: IQuery): Promise<IQueryResult<T>>

  protected abstract findOne<T extends Document>(doc: Document): Promise<T | null>

  protected abstract insertOne<T extends Document>(doc: Document): Promise<T>

  protected abstract updateOne<T extends Document>(doc: Document, update: Document): Promise<T | null>
}

export type CollectionsName = 'logs' | 'tasks' | 'users'
