Feature: Login

  Passing an existent email and password that matches the user account will make the user login into the system.

  Rule: User must have his account activated to fully login
  Rule: The user must be logged out
  Rule: The input must be valid

    Scenario: I should login using valid credentials and with my account activated
      Given I have an account with the following credentials:
        | email              | password | accountActivated |
        | any_email@mail.com | 12345678 | true             |
      Given I am logged out
      When I request to login using the following credentials:
        | email              | password |
        | any_email@mail.com | 12345678 |
      Then I should be logged in
      And I must receive a status code of 200

    Scenario: I should not login using valid credentials but with an inactive account
      Given I have an account with the following credentials:
        | email              | password | accountActivated |
        | any_email@mail.com | 12345678 | false            |
      Given I am logged out
      When I request to login using the following credentials:
        | email              | password |
        | any_email@mail.com | 12345678 |
      Then I should get a message "A conta não está ativada"
      And I must receive a status code of 200

    Scenario: I should not login if I use invalid credentials
      Given I have an account with the following credentials:
        | email              | password | accountActivated |
        | any_email@mail.com | 12345678 | true             |
      Given I am logged out
      When I request to login using the following credentials:
        | email              | password |
        | any_email@mail.com | 87654321 |
      Then I should get an error with message "Suas credenciais estão inválidas"
      And I must receive a status code of 401

