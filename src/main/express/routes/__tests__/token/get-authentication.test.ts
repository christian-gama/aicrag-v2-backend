import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { Express } from 'express'
import request from 'supertest'

describe('get /get-authentication', () => {
  const client = makeMongoDb()
  let app: Express
  let dbIsConnected = true

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()
  })

  it('should return 200 regardless of the result', async () => {
    const result = await request(app).get('/api/v1/token/get-authentication')

    expect(result.status).toBe(200)
  })
})
