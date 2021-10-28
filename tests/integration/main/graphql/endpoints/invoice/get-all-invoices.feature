Feature: Get all invoices

  Based on a month and year, get all tasks from that period. Supports filtering.

  Rule: The user must be logged in
  Rule: The query must be valid

    Scenario: Being logged out
      Given I am logged out
      When I request to get all invoices of type "both"
      Then I should receive an error with message "Token is missing"
      And I must receive a status code of 401

    Scenario: Having invoices from different months
      Given I am logged in
      Given I have the following tasks:
        | commentary     | date                     | duration | status    | taskId | type |
        | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
        | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   |
        | Any commentary | 2021-09-15T08:41:54.351Z | 30       | completed | 3      | TX   |
        | Any commentary | 2021-08-19T07:11:15.912Z | 30       | completed | 4      | TX   |
        | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   |
        | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   |
      When I request to get all invoices of type "both"
      Then I should get the following invoices:
        | month | year | tasks | totalUsd |
        | 0     | 2022 | 1     | 16.25    |
        | 7     | 2021 | 2     | 37       |
        | 8     | 2021 | 1     | 32.5     |
        | 9     | 2021 | 2     | 65       |
      And I must receive a status code of 200

    Scenario: Not having any invoice
      Given I am logged in
      Given I do not have any invoices
      When I request to get all invoices of type "both"
      Then I should not get any invoices
      And I must receive a status code of 200
