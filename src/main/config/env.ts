export const env = {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://mongo/aicrag',
  PORT: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  JWT_SECRET: process.env.JWT_SECRET ?? 'Ql818uILlkG8a8sdklajlm112Ac4yuuX',
  JWT_EXPIRES: process.env.JWT_EXPIRES ?? '30d',
  COOKIE_EXPIRES: process.env.COOKIE_EXPIRES ?? '30',
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? '1X811PvLlkG8a9s1Elajlh142Z34YWum'
}
