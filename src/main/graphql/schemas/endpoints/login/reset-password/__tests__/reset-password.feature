Feature: Reset password

  Once the user send a request to ForgotPassword endpoint and validate his token, he will be able to reset his
  password.

  Rule: The user must be partial logged in. This access is granted after validating his token received through his email;
  Rule: The input must be valid.

    Scenario: Being logged in
      Given I am logged in
      When I request to reset my password with my new password "12345678"
      Then I should receive an error message "Você deve sair da sua conta antes"
      And I must receive a status code of 403

    Scenario: Using a valid input
      Given I have a valid reset password token
      Given I am logged out
      When I request to reset my password with my new password "12345678"
      Then I should have my password changed
      And I must receive a status code of 200

    Scenario: Using an invalid input
      Given I have a valid reset password token
      Given I am logged out
      When I request to reset my password with my an invalid new password "123"
      Then I should receive an error message "Parâmetro inválido: password"
      And I must receive a status code of 400

    Scenario: Using an invalid reset password token
      Given I have an invalid reset password token
      Given I am logged out
      When I request to reset my password with my a valid new password "12345678"
      Then I should receive an error message "O token é inválido"
      And I must receive a status code of 401
