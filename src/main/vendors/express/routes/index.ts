import { makeLogoutController } from '@/main/factories/controllers/account'
import { makeLoginController, makeActivateAccountController, makeForgotPasswordController } from '@/main/factories/controllers/login'
import { makeSignUpController } from '@/main/factories/controllers/signup'
import { makeAccessToken, makeRefreshToken } from '@/main/factories/middlewares/authentication'
import { makeVerifyRefreshToken } from '@/main/factories/providers/token'
import { controllerAdapter } from '../adapters/controller-adapter'
import { isLoggedInMiddlewareAdapter } from '../adapters/is-logged-in-middleware-adapter'
import { tokenMiddlewareAdapter } from '../adapters/token-middleware-adapter'

/* ******* Controllers ******* */
// Authentication Routes
export const loginController = controllerAdapter(makeLoginController())
export const logoutController = controllerAdapter(makeLogoutController())
export const signUpController = controllerAdapter(makeSignUpController())

// Account Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const forgotPasswordController = controllerAdapter(makeForgotPasswordController())
/* **** End of Controllers **** */

/* ********** Middlewares *********** */
export const isLoggedInMiddleware = isLoggedInMiddlewareAdapter(makeVerifyRefreshToken())
export const accessTokenMiddleware = tokenMiddlewareAdapter(makeAccessToken())
export const refreshTokenMiddleware = tokenMiddlewareAdapter(makeRefreshToken())
/* ******* End of Middlewares ******* */
