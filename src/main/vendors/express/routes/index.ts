import { makeLogoutController } from '@/main/factories/controllers/account'
import { makeVerifyResetPasswordTokenController } from '@/main/factories/controllers/helpers'
import { makeSendWelcomeEmailController } from '@/main/factories/controllers/helpers/send-welcome-email-controller-factory,'
import {
  makeActivateAccountController,
  makeForgotPasswordController,
  makeLoginController
} from '@/main/factories/controllers/login'
import { makeResetPasswordController } from '@/main/factories/controllers/login/reset-password-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/signup'
import {
  makePartialProtectedMiddleware,
  makeIsLoggedInMiddleware,
  makeProtectedMiddleware
} from '@/main/factories/middlewares/authentication'

import { controllerAdapter } from '../adapters/controller-adapter'
import { middlewareAdapter } from '../adapters/middleware-adapter'

/* ******* Controllers ******* */
// Account Routes
export const logoutController = controllerAdapter(makeLogoutController())

// Helpers Routes
export const verifyResetPasswordTokenController = controllerAdapter(
  makeVerifyResetPasswordTokenController()
)
export const sendWelcomeEmailController = controllerAdapter(makeSendWelcomeEmailController())

// Login Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const forgotPasswordController = controllerAdapter(makeForgotPasswordController())
export const loginController = controllerAdapter(makeLoginController())
export const resetPasswordController = controllerAdapter(makeResetPasswordController())

// SignUp Routes
export const signUpController = controllerAdapter(makeSignUpController())
/* **** End of Controllers **** */

/* ********** Middlewares *********** */
export const partialProtectedMiddleware = middlewareAdapter(makePartialProtectedMiddleware())
export const isLoggedInMiddleware = middlewareAdapter(makeIsLoggedInMiddleware())
export const protectedMiddleware = middlewareAdapter(makeProtectedMiddleware())
/* ******* End of Middlewares ******* */
