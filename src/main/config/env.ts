/* Node modules */
import dotenv from 'dotenv'
import path from 'path'

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
    ACCESS_EXPIRES: process.env.JWT_EXPIRES?.trim() ?? '10s',
    ACCESS_SECRET: process.env.JWT_SECRET?.trim() ?? 'Ql818uILlkG8a8sdklajlm112Ac4yuuX',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET?.trim() ?? '2Z34YWnfoplk8a8sds1Elajlm81c431x',
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES?.trim() ?? '30d'
  },
  SERVER: {
    NODE_ENV: (process.env.NODE_ENV?.trim() as 'development' | 'production') ?? 'production',
    PORT: process.env.PORT?.trim() ?? 3000
  }
}
