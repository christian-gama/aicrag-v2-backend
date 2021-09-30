import { InvalidTokenError } from '@/application/errors'

export const errorHandler = (err: Error): any => {
  let error = Object.create(err)

  switch (error.name) {
    case 'JsonWebTokenError':
      error = new InvalidTokenError()
      error.statusCode = 401
      break
    case 'TokenExpiredError':
      error = new InvalidTokenError()
      error.statusCode = 401
      break
    default:
      error.statusCode = 500
  }

  return error
}
