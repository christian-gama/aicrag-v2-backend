Feature: Update password

  The user can change his password passing his current password, to make sure it's him that it's requesting the
  password change, and he must pass a new valid password.

  Rule: The user must confirm his current password
  Rule: The user must be logged in
  Rule: The input must be valid

    Scenario: Being logged out
      Given My current password is "12345678"
      Given I am logged out
      When I request to update my password with the following valid input:
        | currentPassword | password | passwordConfirmation |
        | 12345678        | 87654321 | 87654321             |
      Then I should see an error that contains a message "É necessário um token"
      And I must receive a status code of 401

    Scenario: Using a valid input
      Given My current password is "12345678"
      Given I am logged in
      When I request to update my password with the following valid input:
        | currentPassword | password | passwordConfirmation |
        | 12345678        | 87654321 | 87654321             |
      Then I should have my password updated
      And I should have my temporary email removed
      And I must receive a status code of 200

    Scenario: Using an invalid current password
      Given My current password is "12345678"
      Given I am logged in
      When I request to update my password with the following invalid current password:
        | currentPassword | password | passwordConfirmation |
        | 12121212        | 87654321 | 87654321             |
      Then I should receive an error with a message "Suas credenciais estão inválidas"
      And I must receive a status code of 400


    Scenario: Using an invalid password
      Given My current password is "12345678"
      Given I am logged in
      When I request to update my password with the following invalid passwords:
        | currentPassword | password | passwordConfirmation |
        | 12345678        | 123      | 123                  |
      Then I should receive an error with a message "Parâmetro inválido: password"
      And I must receive a status code of 400

