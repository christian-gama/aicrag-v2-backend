/* eslint-disable sort-keys */
export const TaskSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['commentary', 'date', 'duration', 'id', 'logs', 'taskId', 'type', 'userId'],
      properties: {
        commentary: {
          bsonType: 'string',
          maxLength: 400,
          description: 'must be a string and is required'
        },
        date: {
          bsonType: 'object',
          properties: {
            day: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            full: {
              bsonType: 'date',
              description: 'must be a date and is required'
            },
            hours: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            month: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            year: {
              bsonType: 'number',
              description: 'must be a number and is required'
            }
          }
        },
        duration: {
          bsonType: 'number',
          description: 'must be a number and is required'
        },
        id: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        logs: {
          bsonType: 'object',
          properties: {
            createdAt: {
              bsonType: 'date',
              description: 'must be a date and is required'
            },
            updatedAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date and is required'
            }
          }
        },
        status: {
          enum: ['in_progress', 'completed'],
          description: 'can only be one of the enum values and is required'
        },
        taskId: {
          bsonType: 'string',
          maxLength: 120,
          description: 'must be a string and is required'
        },
        type: {
          enum: ['QA', 'TX'],
          description: 'can only be one of the enum values and is required'
        },
        userId: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  }
}
