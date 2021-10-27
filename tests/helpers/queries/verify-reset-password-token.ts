export const verifyResetPasswordTokenQuery = (param: { token: string }): string => `
  query {
    verifyResetPasswordToken (param: { token: "${param.token}" }) {
        accessToken
    }
  }
`
