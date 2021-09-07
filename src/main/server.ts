import { MongoClient } from 'mongodb'
import app from './config/app'
import { env } from './config/env'

MongoClient.connect(env.MONGO_URL)
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`)
      console.log(`http://localhost:${env.PORT}`)
      console.log('Press ctrl+c to exit...')
    })
  })
  .catch((err) => {
    console.log(err)
  })
