import { ErrorName } from '../adapters'
import { GraphQLError } from 'graphql'

export const handleError = (response: any, errors: readonly GraphQLError[] | undefined): void => {
  errors?.forEach((error) => {
    response.data = undefined

    if (checkError(error, 'BadRequestError')) response.http.status = 400
    else if (checkError(error, 'UnauthorizedError')) response.http.status = 401
    else if (checkError(error, 'ForbiddenError')) response.http.status = 403
    else if (checkError(error, 'NotFoundError')) response.http.status = 404
    else if (checkError(error, 'ConflictError')) response.http.status = 409
    else if (checkError(error, 'TooManyRequestsError')) response.http.status = 429
    else response.http.status = 500
  })
}

const checkError = (error: GraphQLError, errorName: ErrorName): boolean => {
  return [error.name, error.originalError?.name].some((name) => name === errorName)
}
