export const sendRecoverPasswordEmailMutation = (input: { email: string }): string => `
  mutation {
    sendRecoverPasswordEmail(input: { email: "${input.email}" }) {
        message
    }
  }
`
