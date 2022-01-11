Feature: Logout

  Makes the user logout, making his refresh token invalid.

  Rule: The user must be logged in

    Scenario: Being logged in
      Given I am logged in
      When I request to logout
      Then I should see a message "Você encerrou sua sessão"
      And I should have my tokenVersion incremented by 1
      And I must receive a status code of 200

    Scenario: Being logged out
      Given I am logged out
      When I request to logout
      Then I should see an error that contains a message "É necessário um token"
      And I must receive a status code of 401
