import { RequestHandler } from 'express'

export const notFound: RequestHandler = (req, res) => {
  res.status(404)
  res.json({ data: { message: `Cannotfindthepath:${req.path}`, status: 'fail' } })
}
