Feature: Create task

  Create a new task that will belong to the user.

  Rule: The user must be logged in
  Rule: The taskId must be unique if different of empty string
  Rule: The input must be valid

    Scenario: Being logged out
      Given I am logged out
      When I try to create a new task with the following data:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

