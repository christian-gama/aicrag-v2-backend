import { IUserRole } from '@/domain'
import {
  makeLogoutController,
  makeUpdateEmailByPinController,
  makeUpdatePasswordController,
  makeUpdateMeController
} from '@/main/factories/controllers/account'
import { makeGetMeController } from '@/main/factories/controllers/account/get-me-controller-factory'
import { makeGetAllInvoicesController, makeGetInvoiceByMonthController } from '@/main/factories/controllers/invoice'
import {
  makeActivateAccountController,
  makeForgotPasswordController,
  makeLoginController
} from '@/main/factories/controllers/login'
import { makeResetPasswordController } from '@/main/factories/controllers/login/reset-password-controller-factory'
import {
  makeSendEmailPinController,
  makeSendRecoverPasswordEmailController,
  makeSendWelcomeEmailController
} from '@/main/factories/controllers/mailer'
import { makeSignUpController } from '@/main/factories/controllers/signup'
import {
  makeCreateTaskController,
  makeDeleteTaskController,
  makeFindAllTasksController,
  makeFindOneTaskController,
  makeUpdateTaskController
} from '@/main/factories/controllers/task'
import { makeVerifyResetPasswordTokenController } from '@/main/factories/controllers/token'
import {
  makePartialProtectedMiddleware,
  makeIsLoggedInMiddleware,
  makeProtectedMiddleware
} from '@/main/factories/middlewares'
import { makePermissionMiddleware } from '@/main/factories/middlewares/permission-middleware-factory'
import { controllerAdapter } from '../adapters/controller-adapter'
import { middlewareAdapter } from '../adapters/middleware-adapter'

/* ******* Controllers ******* */
// Account Routes
export const getMeController = controllerAdapter(makeGetMeController())
export const logoutController = controllerAdapter(makeLogoutController())
export const updateEmailByPinController = controllerAdapter(makeUpdateEmailByPinController())
export const updateMeController = controllerAdapter(makeUpdateMeController())
export const updatePasswordController = controllerAdapter(makeUpdatePasswordController())

// Invoice Routes
export const getAllInvoicesController = controllerAdapter(makeGetAllInvoicesController())
export const getInvoiceByMonthController = controllerAdapter(makeGetInvoiceByMonthController())

// Login Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const forgotPasswordController = controllerAdapter(makeForgotPasswordController())
export const loginController = controllerAdapter(makeLoginController())
export const resetPasswordController = controllerAdapter(makeResetPasswordController())

// Mailer Routes
export const sendRecoverPasswordController = controllerAdapter(makeSendRecoverPasswordEmailController())
export const sendEmailPinController = controllerAdapter(makeSendEmailPinController())
export const sendWelcomeEmailController = controllerAdapter(makeSendWelcomeEmailController())

// SignUp Routes
export const signUpController = controllerAdapter(makeSignUpController())
/* **** End of Controllers **** */

// Task Routes
export const createTaskController = controllerAdapter(makeCreateTaskController())
export const deleteTaskController = controllerAdapter(makeDeleteTaskController())
export const findAllTasksController = controllerAdapter(makeFindAllTasksController())
export const findOneTaskController = controllerAdapter(makeFindOneTaskController())
export const updateTaskController = controllerAdapter(makeUpdateTaskController())

// Token Routes
export const verifyResetPasswordTokenController = controllerAdapter(makeVerifyResetPasswordTokenController())

/* ********** Middlewares *********** */
export const isLoggedInMiddleware = middlewareAdapter(makeIsLoggedInMiddleware())
export const partialProtectedMiddleware = middlewareAdapter(makePartialProtectedMiddleware())
export const protectedMiddleware = middlewareAdapter(makeProtectedMiddleware())
export const administratorMiddleware = middlewareAdapter(makePermissionMiddleware(IUserRole.administrator))
export const moderatorMiddleware = middlewareAdapter(makePermissionMiddleware(IUserRole.moderator))
export const userMiddleware = middlewareAdapter(makePermissionMiddleware(IUserRole.user))
export const guestMiddleware = middlewareAdapter(makePermissionMiddleware(IUserRole.guest))
/* ******* End of Middlewares ******* */
