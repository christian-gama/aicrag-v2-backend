export const forgotPasswordMutation = (input: { email: string }): string => `
  mutation {
    forgotPassword(input: { email: "${input.email}" }) {
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
