import 'module-alias/register'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'

import { environment } from '@/main/config/environment'

import { CreateLogSchema } from '@/schemas/mongodb/log-schema.ts'
import { CreateUserSchema } from '@/schemas/mongodb/user-schema'

MongoAdapter.connect(environment.DB.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default

    await CreateUserSchema()
    await CreateLogSchema()

    app.listen(environment.SERVER.PORT, () => {
      console.log(`Environment: ${environment.SERVER.NODE_ENV}`)
      console.log(
        `Server started at ${new Date(
          Date.now() - 3 * 60 * 60 * 1000
        ).toLocaleTimeString()}, UTC -3:00`
      )
      console.log(`Server listening on port ${environment.SERVER.PORT}`)
      console.log(`http://localhost:${environment.SERVER.PORT}`)
      console.log('Press ctrl+c to exit...')
    })
  })
  .catch((err) => {
    console.log(err)
  })
