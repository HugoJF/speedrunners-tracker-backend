import { Entity } from 'electrodb';
import { ulid } from 'ulid';
import { client, table } from '../dynamodb';

export const MatchRepository = new Entity(
  {
    model: {
      entity: 'match',
      version: '1',
      service: 'speedrunners-tracker-backend',
    },
    attributes: {
      id: {
        type: 'string',
        default: () => ulid(),
      },
      sprint_id: {
        type: 'string',
        required: true,
      },
      map: {
        type: 'string',
        required: true,
      },
      p1_score: {
        type: 'number',
        required: true,
      },
      p2_score: {
        type: 'number',
        required: true,
      },
      created_at: {
        type: 'string',
        set: () => new Date().toISOString(),
        readOnly: true,
      },
      updated_at: {
        type: 'string',
        watch: '*',
        set: () => new Date().toISOString(),
        readOnly: true,
      },
    },
    indexes: {
      bySprintId: {
        pk: {
          field: 'PK',
          composite: ['sprint_id'],
        },
        sk: {
          field: 'SK',
          composite: ['id'],
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
          composite: ['id'],
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
          composite: ['id'],
        },
      },
    },
  },
  { table, client },
);
