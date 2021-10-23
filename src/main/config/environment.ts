/* Node modules */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../config.env') })

export const environment = {
  COOKIES: {
    EXPIRES: (process.env.COOKIE_EXPIRES as string) ?? '30s',
    SECRET: (process.env.COOKIE_SECRET as string) ?? 'Development_Secret_Key'
  },
  DB: {
    MONGO_URL: (process.env.MONGO_URL as string)
  },
  JWT: {
    ACCESS_EXPIRES: (process.env.JWT_EXPIRES as string) ?? '30s',
    ACCESS_SECRET: (process.env.JWT_SECRET as string) ?? 'Development_Secret_Key',
    REFRESH_EXPIRES: (process.env.JWT_REFRESH_EXPIRES as string) ?? '30s',
    REFRESH_SECRET: (process.env.JWT_REFRESH_SECRET as string) ?? 'Development_Secret_Key'
  },
  MAILER: {
    MAILTRAP: {
      HOST: (process.env.MAILTRAP_HOST as string),
      PASSWORD: (process.env.MAILTRAP_PASSWORD as string),
      PORT: (process.env.MAILTRAP_PORT as string),
      USER: (process.env.MAILTRAP_USER as string)
    },
    SENDGRID: {
      APIKEY: (process.env.SENDGRID_APIKEY as string)
    },
    SETTINGS: {
      FROM: 'Aicrag <aicrag.team@gmail.com>'
    }
  },
  SERVER: {
    NODE_ENV:
      ((process.env.NODE_ENV as string).toLowerCase() as
        | 'development'
        | 'production'
        | 'test') ?? 'production',
    PORT: (process.env.PORT as string)
  }
}
