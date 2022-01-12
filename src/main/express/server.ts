import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { environment } from '@/main/config/environment'
import { verifyEnvironment } from '../config/verify-environment'
import { createSchemas, createIndexes } from '@/schemas/mongodb'

console.log('################################################')
verifyEnvironment()
console.log(`Environment: ${environment.SERVER.NODE_ENV}`)

MongoAdapter.connect(environment.DB.MONGO_URL)
  .then(async () => {
    process.on('uncaughtException', (err: Error) => {
      console.log('Found an error (uncaughtException) - Shutting down server...')
      console.error(err)

      process.exit(1)
    })

    const app = await (await import('./config/app')).default.setup()

    await createSchemas()
    await createIndexes()

    const server = app.listen(environment.SERVER.PORT, () => {
      console.log(
        `Server started at ${new Date().toLocaleString('pt-br', {
          timeZone: 'America/Sao_Paulo'
        })}, UTC -3:00`
      )
      console.log(`API Server: ${environment.SERVER.API_URL}${environment.SERVER.PORT}`)
      console.log(`Apollo Server: ${environment.SERVER.GRAPHQL_URL}`)
      console.log('Press ctrl+c to exit...')
    })

    process.on('unhandledRejection', (err: Error) => {
      console.log('Found an error (unhandledRejection)- Shutting down server...')
      console.log(err.name, err.message)

      server.close(() => {
        process.exit(1)
      })
    })

    process.on('SIGTERM', () => {
      console.log('SIGTERM received - Shutting down server...')
      server.close(() => {
        console.log('Process terminated.')
      })
    })
  })
  .catch((err) => {
    console.error('Error at server startup', err)
  })
