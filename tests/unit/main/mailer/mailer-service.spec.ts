import { IMailerSettings } from '@/domain/mailer'

import { MailerServiceError } from '@/application/errors'

import { environment } from '@/main/config/environment'
import { MailerService } from '@/main/mailer/mailer-service'

class DummyService extends MailerService {
  async send (settings: IMailerSettings): Promise<any> {
    return await this.sendEmail(settings)
  }
}

interface SutTypes {
  settings: IMailerSettings
  sut: DummyService
}

const makeSut = (): SutTypes => {
  const settings: IMailerSettings = {
    html: 'any_html',
    subject: 'any_subject',
    text: 'any_text',
    to: 'any_email'
  }

  const sut = new DummyService()

  return { settings, sut }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })
jest.mock('nodemailer')

describe('mailerService', () => {
  beforeEach(() => {
    nodemailer.createTransport.mockClear()
    sendMailMock.mockClear()
  })

  it('should return true if email is sent', async () => {
    const { settings, sut } = makeSut()

    const result = await sut.send(settings)

    expect(result).toBeTruthy()
  })

  it('should call sendMail with correct settings for production environment', async () => {
    const { settings, sut } = makeSut()
    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport')
    environment.SERVER.NODE_ENV = 'production'

    await sut.send(settings)

    expect(createTransportSpy).toHaveBeenCalledWith({
      name: 'nodemailer-sendgrid',
      options: {
        apiKey: environment.MAILER.SENDGRID.APIKEY
      },
      version: '1.0.3'
    })
  })

  it('should call sendMail with correct settings for development environment', async () => {
    const { settings, sut } = makeSut()
    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport')
    environment.SERVER.NODE_ENV = 'development'

    await sut.send(settings)

    expect(createTransportSpy).toHaveBeenCalledWith({
      auth: {
        pass: environment.MAILER.MAILTRAP.PASSWORD,
        user: environment.MAILER.MAILTRAP.USER
      },
      host: environment.MAILER.MAILTRAP.HOST,
      port: +environment.MAILER.MAILTRAP.PORT
    })
  })

  it('should return an error if email is not sent', async () => {
    const { settings, sut } = makeSut()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.send(settings)

    expect(result).toBeInstanceOf(MailerServiceError)
  })
})
