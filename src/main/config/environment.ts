import dotenv from 'dotenv'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'
const root = path.resolve(__dirname, '../../..')
dotenv.config({
  path: path.resolve(__dirname, isProduction ? root + '/.env' : root + '/.env.development')
})

export const environment = {
  COOKIES: {
    EXPIRES: process.env.COOKIE_EXPIRES ?? '30s',
    SECRET: process.env.COOKIE_SECRET ?? 'Development_Secret_Key'
  },
  DB: {
    MONGO_URL: process.env.MONGO_URL
  },
  GRAPHQL: {
    ENDPOINT: process.env.GRAPHQL_ENDPOINT ?? '/graphql'
  },
  JWT: {
    ACCESS_EXPIRES: process.env.JWT_EXPIRES ?? '30s',
    ACCESS_SECRET: process.env.JWT_SECRET ?? 'Development_Secret_Key',
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? '30s',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'Development_Secret_Key'
  },
  MAILER: {
    MAILTRAP: {
      HOST: !isProduction ? process.env.MAILTRAP_HOST : 'not used in production',
      PASSWORD: !isProduction ? process.env.MAILTRAP_PASSWORD : 'not used in production',
      PORT: !isProduction ? process.env.MAILTRAP_PORT : 'not used in production',
      USER: !isProduction ? process.env.MAILTRAP_USER : 'not used in production'
    },
    SENDGRID: {
      API_KEY: isProduction ? process.env.SENDGRID_API_KEY : 'not used in development'
    },
    SETTINGS: {
      FROM: 'Aicrag <aicrag.team@gmail.com>'
    }
  },
  SERVER: {
    API_URL: process.env.API_URL,
    GRAPHQL_URL: `${process.env.API_URL}${process.env.PORT}${process.env.GRAPHQL_ENDPOINT}`,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  }
}
