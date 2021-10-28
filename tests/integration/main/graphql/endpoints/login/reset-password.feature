Feature: Reset password

  I should be able to reset my password after validating my reset password token.

  Scenario: Being logged in
    Given I am logged in
    When I request to reset my password with my new password "12345678"
    Then I should receive an error message "You must logout first"
    And I must receive a status code of 403
