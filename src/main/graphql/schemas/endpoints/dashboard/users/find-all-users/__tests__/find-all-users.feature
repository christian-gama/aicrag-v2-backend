Feature: Get all users

  Should show all the users from the database with specific fields from the user.

  Rule: Only users with role administrator or moderator are able to access this area
  Rule: The user must be logged in

    Scenario: Being logged out
      Given I am logged out
      When I request to get all users
      Then I should receive an error with message "É necessário um token"
      And I must receive a status code of 401

    Scenario: Being a common user
      Given I am logged in as a common user
      When I request to get all users
      Then I should receive an error with message "Você não tem permissão"
      And I must receive a status code of 403

    Scenario: Being an administrator
      Given I am logged in as an administrator
      Given My database contain users with existent tasks
      When I request to get all users
      Then I should receive a list of users including their tasks
      And I must receive a status code of 200

