import { InvalidParamError } from '@/application/errors'

export interface QueryMethodsProtocol {
  fields: (query?: IQuery) => Record<string, 0 | 1> | InvalidParamError
  limit: (query?: IQuery) => number
  page: (query?: IQuery) => number
  sort: (query?: IQuery) => Record<string, -1 | 1>
}

export interface IQueryResult<T> {
  count: number
  displaying: number
  documents: T[]
  page: string
}

export interface IQuery {
  fields?: string
  limit?: string
  page?: string
  sort?: string
}
