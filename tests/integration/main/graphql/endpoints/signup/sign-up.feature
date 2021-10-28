Feature: Sign Up

  Create a new user account passing a unique email. After creating a new account, the user must activate his account
  through an activation code sent to his email. The email must be sent using the SendWelcomeEmail endpoint.

  Rule: The user must be logged out
  Rule: Email must be unique
  Rule: The input must be valid

    Scenario: Being logged in
      Given I am logged in
      When I request try to create my account using the following data:
        | email              | name     | password | passwordConfirmation |
        | any_email@mail.com | Any Name | 12345678 | 12345678             |
      Then I should receive an error with message "You must logout first"
      And I must receive a status code of 403

    Scenario: Using an existent email
      Given I am logged out
      Given There is a user with the email "any_email@mail.com"
      When I request try to create my account using the following data:
        | email              | name     | password | passwordConfirmation |
        | any_email@mail.com | Any Name | 12345678 | 12345678             |
      Then I should receive an error with message "Param already exists: email"
      And I must receive a status code of 409

    Scenario: Using invalid data
      Given I am logged out
      When I request try to create my account using the following invalid data:
        | email        | name     | password | passwordConfirmation |
        | invalid@mail | Any Name | 12345678 | 12345678             |
      Then I should receive an error with message "Invalid param: email"
      And I must receive a status code of 400

    Scenario: Using valid data
      Given I am logged out
      When I request try to create my account using the following data:
        | email              | name     | password | passwordConfirmation |
        | any_email@mail.com | Any Name | 12345678 | 12345678             |
      Then I should have my account created
      And I must receive a status code of 200
