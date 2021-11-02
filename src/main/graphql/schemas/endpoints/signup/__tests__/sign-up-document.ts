export const signUpMutation = (input: {
  email: string
  name: string
  password: string
  passwordConfirmation: string
}): string => `
  mutation {
    signUp(input: {
      email: "${input.email}",
      name: "${input.name}",
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
