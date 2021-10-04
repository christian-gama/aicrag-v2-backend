import { InternalError } from '@/application/errors'

import { environment } from '@/main/config/environment'

export const errorHandler = (err: Error): any => {
  let error = Object.create(err)

  // Development
  if (environment.SERVER.NODE_ENV === 'development') {
    error.statusCode = 500

    return error
  }

  // Production
  error = new InternalError()
  error.statusCode = 500

  return error
}
