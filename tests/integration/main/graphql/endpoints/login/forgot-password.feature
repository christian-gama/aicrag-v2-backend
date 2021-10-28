Feature: Forgot password

  If I forget my password, I should be able to recover my password using the forgot password

  Scenario: Being logged in
    Given I am logged in
    When I request to reset my password using the email "any_email@mail.com"
    Then I should receive an error message "You must logout first"
    And I must receive a status code of 403
