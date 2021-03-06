import { MongoQueries } from '@/infra/adapters/database/mongodb/mongo-queries'

interface SutTypes {
  sut: MongoQueries
}

const makeSut = (): SutTypes => {
  const sut = new MongoQueries()

  return { sut }
}

describe('mongoQueries', () => {
  describe('fields', () => {
    it('should return an object that contains the fields with correct value', async () => {
      const { sut } = makeSut()

      const query = { fields: 'any_field,-other_field' }

      const fields = sut.fields(query)

      expect(fields).toStrictEqual({ any_field: 1, other_field: 0 })
    })

    it('should return an empty object if there is no fields', async () => {
      const { sut } = makeSut()

      const query = {}

      const fields = sut.fields(query)

      expect(fields).toStrictEqual({})
    })
  })

  describe('limit', () => {
    it('should return the limit as number', async () => {
      const { sut } = makeSut()

      const query = { limit: '10' }

      const limit = sut.limit(query)

      expect(limit).toBe(10)
    })

    it('should return a default limit if there is no limit', async () => {
      const { sut } = makeSut()

      const query = {}

      const limit = sut.limit(query)

      expect(limit).toBe(20)
    })
  })

  describe('page', () => {
    it('should return the skip value as number', async () => {
      const { sut } = makeSut()

      const query = { page: '5' }

      const page = sut.page(query)

      expect(page).toBe(80)
    })

    it('should return a default skip if there is no page', async () => {
      const { sut } = makeSut()

      const query = {}

      const page = sut.page(query)

      expect(page).toBe(0)
    })
  })

  describe('sort', () => {
    it('should return an object with correct values', async () => {
      const { sut } = makeSut()

      const query = { sort: 'any_field,-other_field' }

      const sort = sut.sort(query)

      expect(sort).toStrictEqual({ any_field: 1, other_field: -1 })
    })

    it('should return an empty object if there is no sort', async () => {
      const { sut } = makeSut()

      const query = {}

      const sort = sut.sort(query)

      expect(sort).toStrictEqual({})
    })
  })
})
