export const activateAccountMutation = (input: { email: string, activationPin: string }): string => `
  mutation {
    activateAccount (input: { email: "${input.email}", activationPin: "${input.activationPin}" }) {
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
