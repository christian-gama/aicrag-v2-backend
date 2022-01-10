import _cors from 'cors'

export const cors = _cors({
  credentials: true,
  exposedHeaders: ['x-access-token', 'x-refresh-token'],
  methods: 'GET,PATCH,POST,DELETE',
  origin: 'http://localhost:3000'
})
