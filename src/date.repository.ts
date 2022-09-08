import { Entity } from 'electrodb';
import { client, table } from './dynamodb';

export const DateRepository = new Entity(
  {
    model: {
      entity: 'date',
      version: '1',
      service: 'speedrunners-tracker-backend',
    },
    attributes: {
      date: {
        type: 'string',
        required: true,
      },
      denerd_score: {
        type: 'number',
        required: true,
        default: 0,
      },
      chase_score: {
        type: 'number',
        required: true,
        default: 0,
      },
    },
    indexes: {
      all: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pk: {
          field: 'PK',
          composite: [],
          template: 'root',
        },
        sk: {
          field: 'SK',
          composite: ['date'],
        },
      },
    },
  },
  { table, client },
);
