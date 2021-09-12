/* Node modules */
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../../config.env') })

export const env = {
  COOKIES: {
    EXPIRES: process.env.COOKIE_EXPIRES?.trim() ?? '30',
    SECRET: process.env.COOKIE_SECRET?.trim() ?? '1X811PvLlkG8a9s1Elajlh142Z34YWum'
  },
  DB: {
    MONGO_URL: process.env.MONGO_URL?.trim() ?? 'mongodb://mongo/aicrag'
  },
  JWT: {
    EXPIRES: process.env.JWT_EXPIRES?.trim() ?? '30d',
    SECRET: process.env.JWT_SECRET?.trim() ?? 'Ql818uILlkG8a8sdklajlm112Ac4yuuX'
  },
  SERVER: {
    NODE_ENV: (process.env.NODE_ENV?.trim() as 'development' | 'production') ?? 'production',
    PORT: process.env.PORT?.trim() ?? 3000
  }
}
