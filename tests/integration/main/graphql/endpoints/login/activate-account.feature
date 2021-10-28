Feature: Activate account

  I should be able to activate my account using an activation code.

  Scenario: I should be able to activate my account using a valid activation code
    Given I have an account with the following credentials:
      | email              | activationCode |
      | any_email@mail.com | 12345          |
    Given I am partially logged in
    When I request to activate my account using the following credentials:
      | email              | activationCode |
      | any_email@mail.com | 12345          |
    Then I should have my account activated
    And I must receive a status code of 200

  Scenario: I should not be able to activate my account using an invalid activation code
    Given I have an account with the following credentials:
      | email              | activationCode |
      | any_email@mail.com | 12345          |
    Given I am partially logged in
    When I request to activate my account using the following credentials:
      | email              | activationCode |
      | any_email@mail.com | 54321          |
    Then I should receive an error message "Invalid code"
    And I must receive a status code of 400
