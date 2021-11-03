import { InvalidQueryError } from '@/application/errors'
import { QueryMethodsProtocol } from '@/infra/database/protocols/queries-protocol'

export class MongoQueries implements QueryMethodsProtocol {
  fields (query: Record<string, string>): Record<string, 0 | 1> | InvalidQueryError {
    const fields = {}

    if (query.fields) {
      const fieldsArr = query.fields.split(',')

      for (const field of fieldsArr) {
        const cleanField = field.trim().startsWith('-') ? field.substr(1) : field
        fields[cleanField] = field.trim().startsWith('-') ? 0 : 1
      }
    }

    return fields
  }

  limit (query: Record<string, string>): number {
    let limit = 20

    if (query.limit) limit = +query.limit

    return limit
  }

  page (query: Record<string, string>): number {
    let page = 1

    if (query.page) page = +query.page

    return (page - 1) * this.limit(query)
  }

  sort (query: Record<string, string>): Record<string, -1 | 1> {
    const sort = {}

    if (query.sort) {
      const sortArr = query.sort.split(',')
      for (const property of sortArr) {
        const cleanProperty = property.trim().startsWith('-') ? property.substr(1) : property
        sort[cleanProperty] = property.trim().startsWith('-') ? -1 : 1
      }
    }

    return sort
  }
}
