import { DynamoDB } from 'aws-sdk';

type DynamoDBOptions = ConstructorParameters<typeof DynamoDB.DocumentClient>[0];

export const table = `speedrunners-tracker-${process.env.ENVIRONMENT}`;

const localOptions: DynamoDBOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

const nonLocalOptions: DynamoDBOptions = {
  httpOptions: {
    connectTimeout: 1000,
    timeout: 1000,
  },
};

const localEnvironment = process.env.ENVIRONMENT === 'local';
const extraOptions = localEnvironment ? localOptions : nonLocalOptions;

export const client = new DynamoDB.DocumentClient({
  ...extraOptions,
});
