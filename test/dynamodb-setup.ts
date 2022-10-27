import * as AWS from 'aws-sdk';
import * as ddb from 'dynamodb-localhost';
import * as fs from 'fs';

const installPath = process.env.DYNAMODB_LOCAL_INSTALL_PATH || '.dynamodb';

export function dynamodbConnection() {
  return new AWS.DynamoDB({
    endpoint: 'http://localhost:8000',
    region: 'localhost',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
}

export async function createTable(dynamodb, migration) {
  const defaultProvisioning = {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  };

  migration.ProvisionedThroughput = defaultProvisioning;
  if (migration.GlobalSecondaryIndexes) {
    migration.GlobalSecondaryIndexes.forEach((gsi) => {
      gsi.ProvisionedThroughput = defaultProvisioning;
    });
  }

  await dynamodb.createTable(migration).promise();
}

export async function startDynamodb() {
  ddb.start({
    port: 8000,
    install_path: installPath,
  });

  const tablesPath = 'serverless/tables.json';
  const tablesRaw = fs.readFileSync(tablesPath);
  const tables = JSON.parse(tablesRaw.toString());

  await Promise.all(
    tables.map((table) => createTable(dynamodbConnection(), table)),
  );
}

export function stopDynamodb() {
  ddb.stop(8000);
}
