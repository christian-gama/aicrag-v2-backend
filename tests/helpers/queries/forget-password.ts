export const forgetPasswordMutation = (input: { email: string }): string => `
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
