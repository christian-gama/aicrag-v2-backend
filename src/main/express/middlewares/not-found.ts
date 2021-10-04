import { RequestHandler } from 'express'

export const notFound: RequestHandler = (req, res) => {
  res.status(404)
  res.json({ data: { message: `Cannot find the path: ${req.path}`, status: 'fail' } })
}
