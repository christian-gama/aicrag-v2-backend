import { HttpResponse } from '@/presentation/http/protocols'

import { apolloErrorAdapter } from '@/main/graphql/adapters'

export const getHttpResponse = (httpResponse: HttpResponse): any => {
  switch (httpResponse.statusCode) {
    case 200:
      return httpResponse
    case 201:
      return httpResponse
    case 204:
      return httpResponse
    case 400:
      throw apolloErrorAdapter('BadRequestError', httpResponse.data.message, 400)
    case 401:
      throw apolloErrorAdapter('UnauthorizedError', httpResponse.data.message, 401)
    case 403:
      throw apolloErrorAdapter('ForbiddenError', httpResponse.data.message, 403)
    case 404:
      throw apolloErrorAdapter('NotFoundError', httpResponse.data.message, 404)
    case 409:
      throw apolloErrorAdapter('ConflictError', httpResponse.data.message, 409)
    case 429:
      throw apolloErrorAdapter('TooManyRequestsError', httpResponse.data.message, 429)
    default:
      throw apolloErrorAdapter('InternalError', httpResponse.data.message, 500)
  }
}
