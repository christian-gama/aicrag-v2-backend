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
