import { ControllerProtocol } from '.'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ConflictParamError, MustLogoutError } from '@/application/usecases/errors/'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly userValidator: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const signUpUserCredentials = httpRequest.body

    if (httpRequest.user) return this.httpHelper.badRequest(new MustLogoutError())

    const error = await this.userValidator.validate(signUpUserCredentials)

    const emailExists = await this.userDbRepository.findUserByEmail(signUpUserCredentials.email)

    if (emailExists) {
      return this.httpHelper.conflict(new ConflictParamError('email'))
    }

    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const user = await this.userDbRepository.saveUser(signUpUserCredentials)

    const accessToken = this.generateAccessToken.generate(user) as string

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser, accessToken })
  }
}
