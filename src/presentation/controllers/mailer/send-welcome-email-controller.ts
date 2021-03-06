import { IUser } from '@/domain'
import { IPin } from '@/domain/helpers'
import { IMailerService } from '@/domain/mailer'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { AccountAlreadyActivatedError, MailerServiceError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class SendWelcomeEmailController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly sendWelcomeValidator: IValidator,
    private readonly userRepository: IUserRepository,
    private readonly validationCode: IPin,
    private readonly welcomeEmail: IMailerService
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.sendWelcomeValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findByEmail(data.email)) as IUser

    if (user.settings.accountActivated) {
      return this.httpHelper.forbidden(new AccountAlreadyActivatedError())
    }

    if (user?.temporary.activationPinExpiration && user.temporary.activationPinExpiration.getTime() < Date.now()) {
      user = await this.generateNewActivationCode(user)
    }

    const mailerResponse = await this.welcomeEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    const result = this.httpHelper.ok({
      message: `A welcome email with activation pin has been sent to ${user.personal.email}`
    })

    return result
  }

  private async generateNewActivationCode (user: IUser): Promise<IUser> {
    const result = await this.userRepository.updateById(user.personal.id, {
      'temporary.activationPin': this.validationCode.generate(),
      'temporary.activationPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })

    return result as IUser
  }
}
