import { Entity } from 'electrodb';
import { ulid } from 'ulid';
import { client, table } from '../dynamodb';

export const SprintRepository = new Entity(
  {
    model: {
      entity: 'sprint',
      version: '1',
      service: 'speedrunners-tracker-backend',
    },
    attributes: {
      id: {
        type: 'string',
        default: () => ulid(),
      },
      name: {
        type: 'string',
        required: true,
      },
      goal: {
        type: 'number',
        required: true,
      },
      p1_name: {
        type: 'string',
        required: true,
      },
      p1_score: {
        type: 'number',
        default: 0,
      },
      p2_name: {
        type: 'string',
        required: true,
      },
      p2_score: {
        type: 'number',
        default: 0,
      },
      touched_at: {
        type: 'string',
        required: true,
        default: () => new Date().toISOString(),
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
      byId: {
        pk: {
          field: 'PK',
          composite: ['id'],
        },
        sk: {
          field: 'SK',
          composite: [],
        },
      },
      current: {
        index: 'GSI1',
        pk: {
          field: 'GSI1PK',
          composite: [],
          template: 'ALL',
        },
        sk: {
          field: 'GSI1SK',
          composite: ['touched_at'],
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
