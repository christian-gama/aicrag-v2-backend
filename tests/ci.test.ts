import { MongoAdapter } from '@/infra/adapters/database/mongodb'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import glob from 'glob'
import { resolve } from 'path'

const tests = (): any[] =>
  glob.sync(`${resolve(__dirname)}/**/*.ts`).map((content) => {
    if (
      content.match(/\.(test|steps|spec)\.ts$/) &&
      !content.match(/integration\.test\.ts$/) &&
      !content.match(/ci\.test\.ts$/)
    ) {
      return require(content)
    } else return null
  })

describe('integration tests', () => {
  afterAll(async () => {
    const client = makeMongoDb()

    await client.disconnect()
  })

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})

    await MongoAdapter.connect(global.__MONGO_URI__)
  })

  tests()
})
