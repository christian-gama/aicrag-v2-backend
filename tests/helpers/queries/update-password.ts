export const updatePasswordMutation = (input: {
  currentPassword: string
  password: string
  passwordConfirmation: string
}): string => `
  mutation {
    updatePassword (input: {
      currentPassword: "${input.currentPassword}",
      password: "${input.password}",
      passwordConfirmation: "${input.passwordConfirmation}"
    }) {
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
