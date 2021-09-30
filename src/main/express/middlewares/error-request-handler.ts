import { environment } from '@/main/config/environment'

import { errorHandler } from '../handlers/error-handler'

import { ErrorRequestHandler } from 'express'

export const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = errorHandler(err)

  // Development
  if (environment.SERVER.NODE_ENV === 'development') {
    if (error.statusCode.toString().startsWith('4')) {
      res.status(error.statusCode)
      return res.json({
        data: { error: { message: error.message, name: error.name, stack: error.stack } },
        status: 'fail'
      })
    }

    res.status(500)
    return res.json({
      data: { error: { message: error.message, name: error.name, stack: error.stack } },
      status: 'fail'
    })
  }

  // Production
  if (error.statusCode.toString().startsWith('4')) {
    res.status(error.statusCode)
    return res.json({
      data: { message: error.message },
      status: 'fail'
    })
  }

  res.status(500)
  return res.json({
    data: { message: 'Internal error: Try again later' },
    status: 'fail'
  })
}
