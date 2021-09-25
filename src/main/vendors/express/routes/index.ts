import { makeLogoutController } from '@/main/factories/controllers/account'
import { makeActivateAccountController, makeForgotPasswordController, makeLoginController } from '@/main/factories/controllers/login'
import { makeResetPasswordController } from '@/main/factories/controllers/login/reset-password-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/signup'
import { makeVerifyResetPasswordTokenController } from '@/main/factories/controllers/token'
import { makeAccessToken, makeRefreshToken } from '@/main/factories/middlewares/authentication'
import { makeVerifyRefreshToken } from '@/main/factories/providers/token'

import { controllerAdapter } from '../adapters/controller-adapter'
import { isLoggedInMiddlewareAdapter } from '../adapters/is-logged-in-middleware-adapter'
import { tokenMiddlewareAdapter } from '../adapters/token-middleware-adapter'

/* ******* Controllers ******* */
// Account Routes
export const logoutController = controllerAdapter(makeLogoutController())

// Login Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const forgotPasswordController = controllerAdapter(makeForgotPasswordController())
export const loginController = controllerAdapter(makeLoginController())
export const resetPasswordController = controllerAdapter(makeResetPasswordController())

// SignUp Routes
export const signUpController = controllerAdapter(makeSignUpController())

// Token Routes
export const verifyResetPasswordTokenController = controllerAdapter(makeVerifyResetPasswordTokenController())
/* **** End of Controllers **** */

/* ********** Middlewares *********** */
export const accessTokenMiddleware = tokenMiddlewareAdapter(makeAccessToken())
export const isLoggedInMiddleware = isLoggedInMiddlewareAdapter(makeVerifyRefreshToken())
export const refreshTokenMiddleware = tokenMiddlewareAdapter(makeRefreshToken())
/* ******* End of Middlewares ******* */
