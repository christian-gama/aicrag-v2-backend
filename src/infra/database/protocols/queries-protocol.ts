import { InvalidQueryError } from '@/application/errors'

export interface QueryMethodsProtocol {
  fields: (query?: QueryProtocol) => Record<string, 0 | 1> | InvalidQueryError
  limit: (query?: QueryProtocol) => number
  page: (query?: QueryProtocol) => number
  sort: (query?: QueryProtocol) => Record<string, -1 | 1>
}

export interface QueryResultProtocol<T> {
  count: number
  currentPage: number
  documents: T[]
  totalPages: number
}

export interface QueryProtocol {
  fields?: string
  limit?: string
  page?: string
  sort?: string
}
