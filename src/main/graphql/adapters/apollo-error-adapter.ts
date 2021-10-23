import { ApolloError } from 'apollo-server-express'

export const apolloErrorAdapter = (
  errorName: ErrorName,
  message: string,
  statusCode: StatusCode
): ApolloError => {
  class CustomApolloError extends ApolloError {
    constructor (message: string, extensions?: Record<string, any>) {
      super(message, statusCode.toString(), extensions)

      Object.defineProperty(this, 'name', { value: errorName })
    }
  }

  return new CustomApolloError(message)
}

export type ErrorName =
  | 'BadRequestError'
  | 'UnauthorizedError'
  | 'ForbiddenError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'TooManyRequestsError'
  | 'InternalError'

type StatusCode = 400 | 401 | 403 | 404 | 409 | 429 | 500
