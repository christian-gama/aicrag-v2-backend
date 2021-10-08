import { InvalidQueryError } from '@/application/errors'

export interface QueryMethodsProtocol {
  fields: (query?: Record<string, string>) => Record<string, 0 | 1> | InvalidQueryError
  limit: (query?: Record<string, string>) => number
  page: (query?: Record<string, string>) => number
  sort: (query?: Record<string, string>) => Record<string, -1 | 1>
}

export interface QueryResultProtocol<T> {
  count: number
  currentPage: number
  documents: T[]
  totalPages: number
}

export interface QueryProtocol {
  [prop: string]: string
}
