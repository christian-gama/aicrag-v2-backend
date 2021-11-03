import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import glob from 'glob'
import { resolve } from 'path'

const runTests = (): void => {
  glob.sync(`${resolve(__dirname)}/../src/**/*.ts`).forEach((content) => {
    if (content.match(/\.(test|steps|spec)\.ts$/)) require(content)
  })
}

describe('integration tests', () => {
  afterAll(async () => {
    await makeMongoDb().disconnect()
  })

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})

    await MongoAdapter.connect(global.__MONGO_URI__)
  })

  runTests()
})
