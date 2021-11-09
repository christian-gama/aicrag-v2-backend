/* eslint-disable sort-keys */
export const UserSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['logs', 'personal', 'settings', 'temporary', 'tokenVersion'],
      properties: {
        logs: {
          bsonType: 'object',
          required: ['createdAt', 'lastLoginAt', 'lastSeenAt', 'updatedAt'],
          properties: {
            createdAt: {
              bsonType: 'date',
              description: 'must be a date or null and is required'
            },
            lastLoginAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null and is required'
            },
            lastSeenAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null and is required'
            },
            updatedAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null and is required'
            }
          }
        },
        personal: {
          bsonType: 'object',
          required: ['email', 'id', 'name', 'password'],
          properties: {
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            id: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        },
        settings: {
          bsonType: 'object',
          required: ['accountActivated', 'currency', 'handicap'],
          properties: {
            accountActivated: {
              bsonType: 'bool',
              description: 'must be a boolean and is required'
            },
            currency: {
              enum: ['BRL', 'USD'],
              description: 'must be a string and is required'
            },
            handicap: {
              bsonType: ['int', 'double'],
              description: 'must be an int or double and is required'
            },
            role: {
              enum: [4, 3, 2, 1],
              description: 'must be an int and is required'
            }
          }
        },
        temporary: {
          bsonType: 'object',
          required: [
            'activationPin',
            'activationPinExpiration',
            'resetPasswordToken',
            'tempEmail',
            'tempEmailPin',
            'tempEmailPinExpiration'
          ],
          properties: {
            activationPin: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null and is required'
            },
            activationPinExpiration: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null and is required'
            },
            resetPasswordToken: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null and is required'
            },
            tempEmail: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null and is required'
            },
            tempEmailPin: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null and is required'
            },
            tempEmailPinExpiration: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null and is required'
            }
          }
        },
        tokenVersion: {
          bsonType: 'number',
          description: 'must be a number is required'
        }
      }
    }
  }
}
