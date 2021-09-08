export const env = {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://mongo/aicrag',
  PORT: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV ?? 'production'
}
