import { IUser } from '@/domain'
import { IPin } from '@/domain/helpers'
import { IMailerService } from '@/domain/mailer'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MailerServiceError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class SendEmailPinController implements IController {
  constructor (
    private readonly emailPin: IMailerService,
    private readonly httpHelper: IHttpHelper,
    private readonly sendEmailPinValidator: IValidator,
    private readonly userRepository: IUserRepository,
    private readonly validationCode: IPin
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.sendEmailPinValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findByEmail(data.email)) as IUser

    if (user?.temporary.tempEmailPinExpiration && user.temporary.tempEmailPinExpiration.getTime() < Date.now()) {
      user = await this.generateNewEmailPin(user)
    }

    const mailerResponse = await this.emailPin.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    const result = this.httpHelper.ok({
      message: `An email with your pin has been sent to ${user.temporary.tempEmail as string}`
    })

    return result
  }

  private async generateNewEmailPin (user: IUser): Promise<IUser> {
    const result = await this.userRepository.updateById(user.personal.id, {
      'temporary.tempEmailPin': this.validationCode.generate(),
      'temporary.tempEmailPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })

    return result as IUser
  }
}
