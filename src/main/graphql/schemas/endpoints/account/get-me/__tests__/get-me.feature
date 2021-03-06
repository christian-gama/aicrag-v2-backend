Feature: Logout

  Makes the user logout, making his refresh token invalid.

  Rule: The user must be logged in

    Scenario: Being logged in
      Given I am logged in
      When I request to get me
      Then I should get an access token, refresh token and my user
      And I must receive a status code of 200

    Scenario: Being logged out
      Given I am logged out
      When I request to get me
      Then I should see an error that contains a message "É necessário um token"
      And I must receive a status code of 401
