/* Node modules */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../config.env') })

export const environment = {
  COOKIES: {
    EXPIRES: (process.env.COOKIE_EXPIRES as string).trim(),
    SECRET: (process.env.COOKIE_SECRET as string).trim()
  },
  DB: {
    MONGO_URL: (process.env.MONGO_URL as string).trim()
  },
  JWT: {
    ACCESS_EXPIRES: (process.env.JWT_EXPIRES as string).trim().toLowerCase(),
    ACCESS_SECRET: (process.env.JWT_SECRET as string).trim(),
    REFRESH_EXPIRES: (process.env.JWT_REFRESH_EXPIRES as string).trim().toLowerCase(),
    REFRESH_SECRET: (process.env.JWT_REFRESH_SECRET as string).trim()
  },
  MAILER: {
    MAILTRAP: {
      HOST: (process.env.MAILTRAP_HOST as string).trim(),
      PASSWORD: (process.env.MAILTRAP_PASSWORD as string).trim(),
      PORT: (process.env.MAILTRAP_PORT as string).trim(),
      USER: (process.env.MAILTRAP_USER as string).trim()
    },
    SENDGRID: {
      APIKEY: (process.env.SENDGRID_APIKEY as string).trim()
    },
    SETTINGS: {
      FROM: 'Aicrag <aicrag.team@gmail.com>'
    }
  },
  SERVER: {
    NODE_ENV:
      ((process.env.NODE_ENV as string).trim().toLowerCase() as
        | 'development'
        | 'production'
        | 'test') ?? 'production',
    PORT: (process.env.PORT as string).trim()
  }
}
