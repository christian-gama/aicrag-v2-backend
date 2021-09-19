/* Node modules */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../config.env') })

export const env = {
  COOKIES: {
    EXPIRES: process.env.COOKIE_EXPIRES?.trim() ?? '30',
    SECRET: process.env.COOKIE_SECRET?.trim() ?? 'ebcb6513-426a-4cac-ad4a-b768b6e12d59'
  },
  DB: {
    MONGO_URL: process.env.MONGO_URL?.trim() ?? 'mongodb://mongo/aicrag'
  },
  JWT: {
    ACCESS_EXPIRES: process.env.JWT_EXPIRES?.trim() ?? '10s',
    ACCESS_SECRET: process.env.JWT_SECRET?.trim() ?? 'e26f414f-74cb-4f16-a1f1-db6438a1fcd6',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET?.trim() ?? '12f9b733-3ea0-4edf-9e05-33c1003dc9d1',
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES?.trim() ?? '30d'
  },
  SERVER: {
    NODE_ENV: (process.env.NODE_ENV?.trim() as 'development' | 'production') ?? 'production',
    PORT: process.env.PORT?.trim() ?? 3000
  }
}
