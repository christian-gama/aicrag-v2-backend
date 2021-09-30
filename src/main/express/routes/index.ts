import { controllerAdapter } from '../../../infra/adapters/express/controller-adapter'
import { middlewareAdapter } from '../../../infra/adapters/express/middleware-adapter'

import { makeLogoutController } from '@/factories/controllers/account'
import { makeVerifyResetPasswordTokenController } from '@/factories/controllers/helpers'
import { makeSendForgotPasswordEmailController } from '@/factories/controllers/helpers/send-forgot-password-email-controller-factory'
import { makeSendWelcomeEmailController } from '@/factories/controllers/helpers/send-welcome-email-controller-factory,'
import {
  makeActivateAccountController,
  makeForgotPasswordController,
  makeLoginController
} from '@/factories/controllers/login'
import { makeResetPasswordController } from '@/factories/controllers/login/reset-password-controller-factory'
import { makeSignUpController } from '@/factories/controllers/signup'
import {
  makePartialProtectedMiddleware,
  makeIsLoggedInMiddleware,
  makeProtectedMiddleware
} from '@/factories/middlewares'

/* ******* Controllers ******* */
// Account Routes
export const logoutController = controllerAdapter(makeLogoutController())

// Helpers Routes
export const sendForgotPasswordEmailController = controllerAdapter(
  makeSendForgotPasswordEmailController()
)
export const sendWelcomeEmailController = controllerAdapter(makeSendWelcomeEmailController())
export const verifyResetPasswordTokenController = controllerAdapter(
  makeVerifyResetPasswordTokenController()
)

// Login Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const forgotPasswordController = controllerAdapter(makeForgotPasswordController())
export const loginController = controllerAdapter(makeLoginController())
export const resetPasswordController = controllerAdapter(makeResetPasswordController())

// SignUp Routes
export const signUpController = controllerAdapter(makeSignUpController())
/* **** End of Controllers **** */

/* ********** Middlewares *********** */
export const isLoggedInMiddleware = middlewareAdapter(makeIsLoggedInMiddleware())
export const partialProtectedMiddleware = middlewareAdapter(makePartialProtectedMiddleware())
export const protectedMiddleware = middlewareAdapter(makeProtectedMiddleware())
/* ******* End of Middlewares ******* */
