Feature: Get invoice by month

  I should be able to get all my invoices from a specific month from a year.

  Scenario: Being logged out
    Given I am logged out
    When I request to get my invoices from month "9" and year "2021" of type "both"
    Then I should receive an error with message "Token is missing"
    And I must receive a status code of 401

  Scenario: Getting invoices from a specific month and year
    Given I am logged in
    Given I have the following tasks:
      | commentary     | date                     | duration | status    | taskId | type |
      | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
      | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   |
      | Any commentary | 2021-10-15T08:41:54.351Z | 30       | completed | 3      | TX   |
      | Any commentary | 2021-10-19T07:11:15.912Z | 30       | completed | 4      | TX   |
      | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   |
      | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   |
    # Month starts counting from 0 to 11.
    When I request to get my invoices from month "9" and year "2021" of type "both"
    Then I should get the following invoice:
      | commentary     | date                     | duration | status    | taskId | type | usd  |
      | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   | 32.5 |
      | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   | 32.5 |
      | Any commentary | 2021-10-15T08:41:54.351Z | 30       | completed | 3      | TX   | 32.5 |
      | Any commentary | 2021-10-19T07:11:15.912Z | 30       | completed | 4      | TX   | 32.5 |
    And I must receive a status code of 200

  Scenario: Getting invoices from a specific month and year using filters
    Given I am logged in
    Given I have the following tasks:
      | commentary     | date                     | duration | status    | taskId | type |
      | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   |
      | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   |
      | Any commentary | 2021-10-15T08:41:54.351Z | 30       | completed | 3      | TX   |
      | Any commentary | 2021-10-19T07:11:15.912Z | 30       | completed | 4      | TX   |
      | Any commentary | 2021-08-31T23:59:59.999Z | 2.4      | completed | 5      | QA   |
      | Any commentary | 2022-01-01T00:00:00.000Z | 15       | completed | 6      | TX   |
    # Month starts counting from 0 to 11.
    When I request to get my invoices from month "9" and year "2021" of type "both" limiting by "1"
    Then I should get the following invoice:
      | commentary     | date                     | duration | status    | taskId | type | usd  |
      | Any commentary | 2021-10-27T14:32:33.465Z | 30       | completed | 1      | TX   | 32.5 |
      | Any commentary | 2021-10-24T15:12:38.773Z | 30       | completed | 2      | TX   | 32.5 |
      | Any commentary | 2021-10-15T08:41:54.351Z | 30       | completed | 3      | TX   | 32.5 |
      | Any commentary | 2021-10-19T07:11:15.912Z | 30       | completed | 4      | TX   | 32.5 |
    And The displaying count should be "1"
    And The amount page should be "1 of 4"
    And I must receive a status code of 200
