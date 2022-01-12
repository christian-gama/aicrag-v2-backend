declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PORT: string
    API_URL: string
    WEB_URL: string
    GRAPHQL_ENDPOINT: string
    SENDGRID_API_KEY?: string
    MAILTRAP_HOST?: string
    MAILTRAP_PORT?: string
    MAILTRAP_USER?: string
    MAILTRAP_PASSWORD?: string
    COOKIE_EXPIRES: string
    COOKIE_SECRET: string
    MONGO_URL: string
    JWT_EXPIRES: string
    JWT_SECRET: string
    JWT_REFRESH_EXPIRES: string
    JWT_REFRESH_SECRET: string
    TEST_SEND_EMAIL: string
  }
}
