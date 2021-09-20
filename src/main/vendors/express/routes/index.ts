import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeLogoutController } from '@/main/factories/controllers/authentication/logout/logout-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'
import { makeAccessToken } from '@/main/factories/middlewares/authentication/access-token'
import { makeRefreshToken } from '@/main/factories/middlewares/authentication/refresh-token'
import { makeVerifyRefreshToken } from '@/main/factories/providers/token/verify-refresh-token-factory'
import { controllerAdapter } from '../adapters/controller-adapter'
import { isLoggedInMiddlewareAdapter } from '../adapters/is-logged-in-middleware-adapter'
import { tokenMiddlewareAdapter } from '../adapters/token-middleware-adapter'

/* ******* Controllers ******* */
// Authentication Routes
export const activateAccountController = controllerAdapter(makeActivateAccountController())
export const loginController = controllerAdapter(makeLoginController())
export const logoutController = controllerAdapter(makeLogoutController())
export const signUpController = controllerAdapter(makeSignUpController())
/* **** End of Controllers **** */

/* ********** Middlewares *********** */
export const isLoggedInMiddleware = isLoggedInMiddlewareAdapter(makeVerifyRefreshToken())
export const accessTokenMiddleware = tokenMiddlewareAdapter(makeAccessToken())
export const refreshTokenMiddleware = tokenMiddlewareAdapter(makeRefreshToken())
/* ******* End of Middlewares ******* */
