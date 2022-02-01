Feature: Get authentication

  Get the authentication status based on the received token.

  Scenario: Being logged in
    Given I am logged in
    When I try to verify my tokens
    Then I should receive authentication "protected"
    And I must receive a status code of 200

  Scenario: Being partially logged in
    Given I am partially logged in
    When I try to verify my token using an access token
    Then I should receive authentication "partial"
    And I must receive a status code of 200

  Scenario: Being logged out
    Given I am logged out
    When I try to verify my tokens
    Then I should receive authentication "none"
    And I must receive a status code of 200
