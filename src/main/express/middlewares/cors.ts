import { environment } from '@/main/config/environment'
import _cors from 'cors'

export const cors = _cors({
  credentials: true,
  exposedHeaders: ['x-access-token', 'x-refresh-token'],
  methods: 'GET,PATCH,POST,DELETE',
  origin: environment.SERVER.NODE_ENV === 'production' ? 'https://aicrag.netlify.app' : 'http://localhost:3000'
})
