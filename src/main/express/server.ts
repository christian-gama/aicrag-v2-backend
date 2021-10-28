import 'module-alias/register'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'

import { environment } from '@/main/config/environment'

import { verifyEnvironment } from '../config/verify-environment'

import { createSchemas, createIndexes } from '@/schemas/mongodb'

MongoAdapter.connect(environment.DB.MONGO_URL)
  .then(async () => {
    verifyEnvironment()

    const { setupApp } = await import('./config/app')
    const app = await setupApp()

    await createSchemas()
    await createIndexes()

    app.listen(environment.SERVER.PORT, () => {
      console.log(`Environment: ${environment.SERVER.NODE_ENV}`)
      console.log(
        `Server started at ${new Date().toLocaleString('pt-br', {
          timeZone: 'America/Sao_Paulo'
        })}, UTC -3:00`
      )
      console.log(`API Server: ${environment.SERVER.API_URL}${environment.SERVER.PORT}`)
      console.log(`Apollo Server: ${environment.SERVER.GRAPHQL_URL}`)
      console.log('Press ctrl+c to exit...')
    })
  })
  .catch((err) => {
    console.log(err)
  })
