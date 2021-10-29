/* eslint-disable jest/no-conditional-expect */
import { MongoAdapter } from '@/infra/adapters/database/mongodb'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import glob from 'glob'
import { resolve } from 'path'

const tests = glob
  .sync(`${resolve(__dirname)}/**/*.ts`)
  .map((content) => {
    if (content.match(/\.steps\.ts$/)) return require(content)
    else return null
  })
  .filter((content: any) => content != null)

describe('integration tests', () => {
  afterAll(async () => {
    const client = makeMongoDb()

    await client.disconnect()
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)
  })

  tests.forEach((test) => test.default())
})
