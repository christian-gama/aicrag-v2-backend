import { ErrorRequestHandler } from 'express'
import { env } from '../config/env'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (env.SERVER.NODE_ENV === 'development') {
    res.status(500)
    res.json({
      status: 'fail',
      data: { error: { name: err.name, message: err.message, stack: err.stack } }
    })
  } else {
    res.status(500)
    res.json({
      status: 'fail',
      data: { message: 'Internal error: Try again later' }
    })
  }
}
