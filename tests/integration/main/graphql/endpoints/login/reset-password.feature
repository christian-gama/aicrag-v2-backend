Feature: Reset password

  I should be able to reset my password after validating my reset password token.

  Scenario: Being logged in
    Given I am logged in
    When I request to reset my password with my new password "12345678"
    Then I should receive an error message "You must logout first"
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
    Then I should receive an error message "Invalid param: password"
    And I must receive a status code of 400

  Scenario: Using an invalid reset password token
    Given I have an invalid reset password token
    Given I am logged out
    When I request to reset my password with my a valid new password "12345678"
    Then I should receive an error message "Token is invalid"
    And I must receive a status code of 401
