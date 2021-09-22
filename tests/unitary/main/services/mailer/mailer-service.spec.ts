import { makeSut } from './mailer-service-sut'

import { env } from '@/main/config/env'
import { MailerServiceError } from '@/application/usecases/errors'

jest.mock('nodemailer')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('MailerService', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  it('Should return true if email is sent', async () => {
    const { sut, settings } = makeSut()

    const result = await sut.send(settings)

    expect(result).toEqual(true)
  })

  it('Should call sendMail with correct settings for production environment', async () => {
    env.SERVER.NODE_ENV = 'production'

    const { sut, settings } = makeSut()

    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport')

    await sut.send(settings)

    expect(createTransportSpy).toHaveBeenCalledWith({
      name: 'nodemailer-sendgrid',
      options: {
        apiKey: env.MAILER.SENDGRID.APIKEY
      },
      version: '1.0.3'
    })
  })

  it('Should call sendMail with correct settings for development environment', async () => {
    env.SERVER.NODE_ENV = 'development'

    const { sut, settings } = makeSut()

    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport')

    await sut.send(settings)

    expect(createTransportSpy).toHaveBeenCalledWith({
      auth: {
        pass: env.MAILER.MAILTRAP.PASSWORD,
        user: env.MAILER.MAILTRAP.USER
      },
      host: env.MAILER.MAILTRAP.HOST,
      port: +env.MAILER.MAILTRAP.PORT
    })
  })

  it('Should return an error if email is not sent', async () => {
    const { sut, settings } = makeSut()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.send(settings)

    expect(result).toBeInstanceOf(MailerServiceError)
  })
})
