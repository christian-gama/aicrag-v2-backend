export const env = {
  COOKIES: {
    EXPIRES: process.env.COOKIE_EXPIRES ?? '30',
    SECRET: process.env.COOKIE_SECRET ?? '1X811PvLlkG8a9s1Elajlh142Z34YWum'
  },
  DB: {
    MONGO_URL: process.env.MONGO_URL ?? 'mongodb://mongo/aicrag'
  },
  JWT: {
    EXPIRES: process.env.JWT_EXPIRES ?? '30d',
    SECRET: process.env.JWT_SECRET ?? 'Ql818uILlkG8a8sdklajlm112Ac4yuuX'
  },
  SERVER: {
    NODE_ENV: process.env.NODE_ENV ?? 'production',
    PORT: process.env.PORT ?? 3000
  }
}
