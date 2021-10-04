import { InternalError } from '@/application/errors'

export const errorHandler = (err: Error): any => {
  let error = Object.create(err)

  switch (error.name) {
    default:
      error = new InternalError()
      error.statusCode = 500
  }

  return error
}
