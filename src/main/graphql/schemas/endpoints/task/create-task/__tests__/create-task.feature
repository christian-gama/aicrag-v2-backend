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
      Then I should receive an error with message "É necessário um token"
      And I must receive a status code of 401

    Scenario: Using an existent task id
      Given I am logged in
      Given I already have a task with taskId of 1
      When I try to create a new task with the following data:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
      Then I should receive an error with message "Parâmetro já existe: taskId"
      And I must receive a status code of 409

    Scenario Outline: Using an invalid input
      Given I am logged in
      When I try to create a new task with the following invalid data <commentary> <date> <duration> <status> <taskId> <type>
      Then I should receive an error with message of invalid param
      And I must receive a status code of 400

      Examples:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 100      | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | -100     | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 5        | completed | 1      | QA   |
        | Any commentary | 2021-10-27T14:32:33.465Z | -5       | completed | 1      | QA   |

    Scenario Outline: Using a valid input
      Given I am logged in
      When I try to create a new task with the following valid data <commentary> <date> <duration> <status> <taskId> <type>
      Then I should have created a new task
      And I must receive a status code of 200

      Examples:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 1        | completed | 1      | TX   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 2.5      | completed | 1      | QA   |
        | Any commentary | 2021-10-27T14:32:33.465Z | 1        | completed | 1      | QA   |


