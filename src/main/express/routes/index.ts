import {
  makeLogoutController,
  makeUpdateEmailByCodeController,
  makeUpdatePasswordController,
  makeUpdateUserController
} from '@/factories/controllers/account'
import {
  makeActivateAccountController,
  makeForgotPasswordController,
  makeLoginController
} from '@/factories/controllers/login'
import { makeResetPasswordController } from '@/factories/controllers/login/reset-password-controller-factory'
import {
  makeSendEmailCodeController,
  makeSendForgotPasswordEmailController,
  makeSendWelcomeEmailController
} from '@/factories/controllers/mailer'
import { makeSignUpController } from '@/factories/controllers/signup'
import { makeCreateTaskController } from '@/factories/controllers/task/create-task-controller-factory'
import { makeVerifyResetPasswordTokenController } from '@/factories/controllers/token'
import {
  makePartialProtectedMiddleware,
  makeIsLoggedInMiddleware,
  makeProtectedMiddleware
} from '@/factories/middlewares'

import { controllerAdapter } from '../adapters/controller-adapter'
import { middlewareAdapter } from '../adapters/middleware-adapter'

/* ******* Controllers ******* */
// Account Routes
export const logoutController = controllerAdapter(makeLogoutController())
export const updateEmailByCodeController = controllerAdapter(makeUpdateEmailByCodeController())
export const updatePassword = controllerAdapter(makeUpdatePasswordController())
export const updateUserController = controllerAdapter(makeUpdateUserController())

// Login Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const forgotPasswordController = controllerAdapter(makeForgotPasswordController())
export const loginController = controllerAdapter(makeLoginController())
export const resetPasswordController = controllerAdapter(makeResetPasswordController())

// Mailer Routes
export const sendForgotPasswordEmailController = controllerAdapter(
  makeSendForgotPasswordEmailController()
)
export const sendEmailCodeController = controllerAdapter(makeSendEmailCodeController())
export const sendWelcomeEmailController = controllerAdapter(makeSendWelcomeEmailController())

// SignUp Routes
export const signUpController = controllerAdapter(makeSignUpController())
/* **** End of Controllers **** */

// Task Routes
export const createTaskController = controllerAdapter(makeCreateTaskController())

// Token Routes
export const verifyResetPasswordTokenController = controllerAdapter(
  makeVerifyResetPasswordTokenController()
)
/* ********** Middlewares *********** */
export const isLoggedInMiddleware = middlewareAdapter(makeIsLoggedInMiddleware())
export const partialProtectedMiddleware = middlewareAdapter(makePartialProtectedMiddleware())
export const protectedMiddleware = middlewareAdapter(makeProtectedMiddleware())
/* ******* End of Middlewares ******* */
