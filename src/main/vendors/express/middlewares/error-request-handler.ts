import { environment } from '@/main/config/environment'
import { errorHandler } from '../helpers/error-handler'

import { ErrorRequestHandler } from 'express'

export const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = errorHandler(err)

  // Development
  if (environment.SERVER.NODE_ENV === 'development') {
    if (error.statusCode.toString().startsWith('4')) {
      res.status(error.statusCode)
      return res.json({
        status: 'fail',
        data: { error: { name: error.name, message: error.message, stack: error.stack } }
      })
    }

    res.status(500)
    return res.json({
      status: 'fail',
      data: { error: { name: error.name, message: error.message, stack: error.stack } }
    })
  }

  // Production
  if (error.statusCode.toString().startsWith('4')) {
    res.status(error.statusCode)
    return res.json({
      status: 'fail',
      data: { message: error.message }
    })
  }

  res.status(500)
  return res.json({
    status: 'fail',
    data: { message: 'Internal error: Try again later' }
  })
}
