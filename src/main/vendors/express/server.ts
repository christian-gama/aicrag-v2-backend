import 'module-alias/register'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { env } from '@/main/config/env'

MongoHelper.connect(env.DB.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(env.SERVER.PORT, () => {
      const now = Date.now() - 3 * 60 * 60 * 1000

      console.log(`Environment: ${env.SERVER.NODE_ENV}`)
      console.log(`Server started at ${new Date(now).toLocaleTimeString()}, UTC -3:00`)
      console.log(`Server listening on port ${env.SERVER.PORT}`)
      console.log(`http://localhost:${env.SERVER.PORT}`)
      console.log('Press ctrl+c to exit...')
    })
  })
  .catch((err) => {
    console.log(err)
  })
