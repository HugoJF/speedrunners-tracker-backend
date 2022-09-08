import { Entity } from 'electrodb';
import { client, table } from './dynamodb';

export const MatchRepository = new Entity(
  {
    model: {
      entity: 'match',
      version: '1',
      service: 'speedrunners-tracker-backend',
    },
    attributes: {
      map: {
        type: 'string',
        required: true,
      },
      denerd_score: {
        type: 'number',
        required: true,
      },
      chase_score: {
        type: 'number',
        required: true,
      },
      date: {
        type: 'string',
        required: true,
      },
      time: {
        type: 'string',
        required: true,
      },
    },
    indexes: {
      byDate: {
        pk: {
          field: 'PK',
          composite: ['date'],
        },
        sk: {
          field: 'SK',
          composite: ['time'],
        },
      },
      byMap: {
        index: 'GSI1',
        pk: {
          field: 'GSI1PK',
          composite: ['map'],
        },
        sk: {
          field: 'GSI1SK',
          composite: ['date', 'time'],
        },
      },
      all: {
        index: 'GSI2',
        pk: {
          field: 'GSI2PK',
          composite: [],
          template: 'ALL',
        },
        sk: {
          field: 'GSI2SK',
          composite: ['date', 'time'],
        },
      },
    },
  },
  { table, client },
);
