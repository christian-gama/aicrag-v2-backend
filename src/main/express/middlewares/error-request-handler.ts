import { environment } from '@/main/config/environment'

import { errorHandler } from '../handlers/error-handler'

import { ErrorRequestHandler } from 'express'

export const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = errorHandler(err)

  // Development
  if (environment.SERVER.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      data: { error: { message: error.message, name: error.name, stack: error.stack } },
      status: 'fail'
    })
  }

  // Production
  return res.status(error.statusCode).json({
    data: { error: { message: error.message } },
    status: 'fail'
  })
}
