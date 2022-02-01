export const activateAccountMutation = (input: { userId: string, activationPin: string }): string => `
  mutation {
    activateAccount (input: { userId: "${input.userId}", activationPin: "${input.activationPin}" }) {
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
