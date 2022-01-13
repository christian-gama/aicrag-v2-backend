import dotenv from 'dotenv'
import path from 'path'

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test' &&
  process.env.NODE_ENV !== 'development'
) {
  console.error('Invalid environment variable: NODE_ENV (expected production, test or development)')
  process.exit(1)
}

const isProduction = process.env.NODE_ENV === 'production'
const root = path.resolve(__dirname, '../../..')
dotenv.config({
  path: path.resolve(__dirname, isProduction ? root + '/.env' : root + '/.env.development')
})

export const environment = {
  COOKIES: {
    EXPIRES: process.env.COOKIE_EXPIRES ?? '3s',
    SECRET: process.env.COOKIE_SECRET ?? 'test_secret_key'
  },
  DB: {
    MONGO_URL: process.env.MONGO_URL
  },
  GRAPHQL: {
    ENDPOINT: process.env.GRAPHQL_ENDPOINT ?? '/graphql'
  },
  JWT: {
    ACCESS_EXPIRES: process.env.JWT_EXPIRES ?? '3s',
    ACCESS_SECRET: process.env.JWT_SECRET ?? 'test_secret_key',
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? '3s',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'test_secret_key'
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
    PORT: process.env.PORT,
    WEB_URL: process.env.WEB_URL ?? 'used in test'
  }
}
