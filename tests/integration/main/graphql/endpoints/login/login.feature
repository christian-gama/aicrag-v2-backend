Feature: Login

  I should be able to login using valid credentials when I request to.

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
    Then I should get a message "Account is not activated"
    And I must receive a status code of 200

