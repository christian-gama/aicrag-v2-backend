import { SignUpController } from '../../../src/presentation/controllers/signup/signup-controllers'

describe('SignUpController', () => {
  it('Should return 200 if succeds', async () => {
    const sut = new SignUpController()

    const response = await sut.handle({ body: {} })

    expect(response.statusCode).toBe(200)
  })
})
