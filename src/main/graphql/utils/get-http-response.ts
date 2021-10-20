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
      throw apolloErrorAdapter(httpResponse.data.message, 400, 'BadRequestError')
    case 401:
      throw apolloErrorAdapter(httpResponse.data.message, 401, 'UnauthorizedError')
    case 403:
      throw apolloErrorAdapter(httpResponse.data.message, 403, 'ForbiddenError')
    case 404:
      throw apolloErrorAdapter(httpResponse.data.message, 404, 'NotFoundError')
    case 409:
      throw apolloErrorAdapter(httpResponse.data.message, 409, 'ConflictError')
    case 429:
      throw apolloErrorAdapter(httpResponse.data.message, 409, 'TooManyRequestsError')
    default:
      throw apolloErrorAdapter(httpResponse.data.message, 500, 'InternalError')
  }
}
