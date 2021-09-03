import { ok } from '@/presentation/http/http'
import { SignUpController } from '@/presentation/controllers/signup/signup-controllers'

describe('SignUpController', () => {
  it('Should return ok if succeds', async () => {
    const sut = new SignUpController()

    const response = await sut.handle({ body: {} })

    expect(response).toEqual(ok({}))
  })
})
