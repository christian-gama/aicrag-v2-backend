Feature: Find one task

  Find a task using a valid ID.

  Rule: The user must be logged in
  Rule: The param must be valid

    Scenario: Being logged out
      Given I am logged out
      When I try to find one task
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

    Scenario: Having an existent task
      Given I have a task of id "a79d845b-da8f-4e57-9bdd-c36a33813d0c"
      Given I am logged in
      When I try to find one task using the id "a79d845b-da8f-4e57-9bdd-c36a33813d0c"
      Then I should get the task
      And I must receive a status code of 200

    Scenario: Task does not exist
      Given I have a task of id "a79d845b-da8f-4e57-9bdd-c36a33813d0c"
      Given I am logged in
      When I try to find one task using a non-existent id "c5f657f2-ffa3-4378-8714-11c6532e1a02"
      Then I should receive an error message "No tasks were found"
      And I must receive a status code of 400
