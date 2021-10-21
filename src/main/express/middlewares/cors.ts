import _cors from 'cors'

export const cors = _cors({
  credentials: true,
  methods: 'GET,PATCH,POST,DELETE',
  origin: 'http://localhost:3000'
})
