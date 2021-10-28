import { MongoAdapter } from '@/infra/adapters/database/mongodb'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { testLogout } from './main/graphql/endpoints/account/logout.steps'
import { testUpdateEmailByPin } from './main/graphql/endpoints/account/update-email-by-pin.steps'
import { testUpdateUser } from './main/graphql/endpoints/account/update-user.steps'
import { testGetAllInvoices } from './main/graphql/endpoints/invoice/get-all-invoices.steps'
import { testGetInvoiceByMonth } from './main/graphql/endpoints/invoice/get-invoice-by-month.steps'
import { testActivateAccount } from './main/graphql/endpoints/login/activate-account.steps'
import { testForgotPassword } from './main/graphql/endpoints/login/forgot-password.steps'
import { testLogin } from './main/graphql/endpoints/login/login.steps'
import { testResetPassword } from './main/graphql/endpoints/login/reset-password.steps'
import { testSendEmailPin } from './main/graphql/endpoints/mailer/send-email-pin.steps'
import { testSendRecoverPasswordEmail } from './main/graphql/endpoints/mailer/send-recover-password-email.steps'
import { testSendWelcomeEmail } from './main/graphql/endpoints/mailer/send-welcome-email.steps'
import { testSignUp } from './main/graphql/endpoints/signup/sign-up.steps'
import { testCreateTask } from './main/graphql/endpoints/task/create-task.steps'

// eslint-disable-next-line jest/valid-title
describe('run tests that uses database connection', () => {
  afterAll(async () => {
    const client = makeMongoDb()

    await client.disconnect()
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)
  })

  testLogout()
  testUpdateEmailByPin()
  testUpdateUser()
  testGetAllInvoices()
  testGetInvoiceByMonth()
  testActivateAccount()
  testForgotPassword()
  testLogin()
  testResetPassword()
  testSendEmailPin()
  testSendRecoverPasswordEmail()
  testSendWelcomeEmail()
  testSignUp()
  testCreateTask()
})
