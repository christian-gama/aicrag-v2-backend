export const activateAccountMutation = (input: { email: string, activationCode: string }): string => `
  mutation {
    activateAccount (input: { email: "${input.email}", activationCode: "${input.activationCode}" }) {
        accessToken
        refreshToken
        user {
            personal {
                email
                id
                name
            }
            settings {
                currency
            }
        }
    }
  }
`
