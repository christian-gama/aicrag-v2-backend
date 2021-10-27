export const resetPasswordMutation = (input: { password: string, passwordConfirmation: string }): string => `
  mutation {
    resetPassword(input: { password: "${input.password}", passwordConfirmation: "${input.passwordConfirmation}" }) {
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
